/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Google Cloud Storage (GCS) Nearline Archiver.
 * @module @cmox/plugin-gcs-archiver/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { GoogleCloudStorageGCSNearlineArchiverGuardrails } from './guardrails';
import { GoogleCloudStorageGCSNearlineArchiverThirdPartyAdapter } from './adapter';

export class GoogleCloudStorageGCSNearlineArchiverPipeline {
  private guardrails: GoogleCloudStorageGCSNearlineArchiverGuardrails;
  private adapter: GoogleCloudStorageGCSNearlineArchiverThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: GoogleCloudStorageGCSNearlineArchiverThirdPartyAdapter) {
    this.guardrails = new GoogleCloudStorageGCSNearlineArchiverGuardrails();
    this.adapter = adapter || new GoogleCloudStorageGCSNearlineArchiverThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Google Cloud Storage (GCS) Nearline Archiver Pipeline] Validation failed: ${validation.errors.join(', ')}`);
    }

    this.sequenceCounter++;
    const payloadJson = JSON.stringify(validation.sanitizedData);
    const checksum = createHash('sha256').update(payloadJson).digest('hex');

    let envelope: StreamPayload<T> = {
      id: `evt_${Date.now()}_${this.sequenceCounter}`,
      sequence: this.sequenceCounter,
      timestamp: Date.now(),
      source,
      action,
      data: validation.sanitizedData,
      checksumSha256: checksum
    };

    envelope = await this.adapter.executePreIngest(envelope);
    return envelope;
  }
}

/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for S3 & MinIO Immutable Archiver.
 * @module @cmox/plugin-s3-snapshot-archiver/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { S3MinIOImmutableArchiverGuardrails } from './guardrails';
import { S3MinIOImmutableArchiverThirdPartyAdapter } from './adapter';

export class S3MinIOImmutableArchiverPipeline {
  private guardrails: S3MinIOImmutableArchiverGuardrails;
  private adapter: S3MinIOImmutableArchiverThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: S3MinIOImmutableArchiverThirdPartyAdapter) {
    this.guardrails = new S3MinIOImmutableArchiverGuardrails();
    this.adapter = adapter || new S3MinIOImmutableArchiverThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    // Stage 1: Guardrail & Rate Limiting
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[S3 & MinIO Immutable Archiver Pipeline] Validation failed: ${validation.errors.join(', ')}`);
    }

    // Stage 2: Normalization & Sequencing
    this.sequenceCounter++;
    const payloadJson = JSON.stringify(validation.sanitizedData);

    // Stage 3: Cryptographic Integrity Checksum (SHA-256)
    const checksum = createHash('sha256').update(payloadJson).digest('hex');

    // Stage 4: Envelope Construction
    let envelope: StreamPayload<T> = {
      id: `evt_${Date.now()}_${this.sequenceCounter}`,
      sequence: this.sequenceCounter,
      timestamp: Date.now(),
      source,
      action,
      data: validation.sanitizedData,
      checksumSha256: checksum
    };

    // Stage 5: Third-party Pre-Ingest Middleware Interception
    envelope = await this.adapter.executePreIngest(envelope);

    return envelope;
  }
}

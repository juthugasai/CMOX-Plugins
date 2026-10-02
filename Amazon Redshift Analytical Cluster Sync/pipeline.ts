/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Amazon Redshift Analytical Cluster Sync.
 * @module @cmox/plugin-redshift-cluster-sync/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { AmazonRedshiftAnalyticalClusterSyncGuardrails } from './guardrails';
import { AmazonRedshiftAnalyticalClusterSyncThirdPartyAdapter } from './adapter';

export class AmazonRedshiftAnalyticalClusterSyncPipeline {
  private guardrails: AmazonRedshiftAnalyticalClusterSyncGuardrails;
  private adapter: AmazonRedshiftAnalyticalClusterSyncThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: AmazonRedshiftAnalyticalClusterSyncThirdPartyAdapter) {
    this.guardrails = new AmazonRedshiftAnalyticalClusterSyncGuardrails();
    this.adapter = adapter || new AmazonRedshiftAnalyticalClusterSyncThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    // Stage 1: Guardrail & Rate Limiting
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Amazon Redshift Analytical Cluster Sync Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

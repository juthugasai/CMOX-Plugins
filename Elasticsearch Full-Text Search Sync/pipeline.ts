/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Elasticsearch Full-Text Search Sync.
 * @module @cmox/plugin-elasticsearch-sync/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { ElasticsearchFullTextSearchSyncGuardrails } from './guardrails';
import { ElasticsearchFullTextSearchSyncThirdPartyAdapter } from './adapter';

export class ElasticsearchFullTextSearchSyncPipeline {
  private guardrails: ElasticsearchFullTextSearchSyncGuardrails;
  private adapter: ElasticsearchFullTextSearchSyncThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: ElasticsearchFullTextSearchSyncThirdPartyAdapter) {
    this.guardrails = new ElasticsearchFullTextSearchSyncGuardrails();
    this.adapter = adapter || new ElasticsearchFullTextSearchSyncThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    // Stage 1: Guardrail & Rate Limiting
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Elasticsearch Full-Text Search Sync Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

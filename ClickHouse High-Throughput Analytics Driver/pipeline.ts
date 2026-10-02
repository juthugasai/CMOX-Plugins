/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for ClickHouse High-Throughput Analytics Driver.
 * @module @cmox/plugin-clickhouse-driver/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { ClickHouseHighThroughputAnalyticsDriverGuardrails } from './guardrails';
import { ClickHouseHighThroughputAnalyticsDriverThirdPartyAdapter } from './adapter';

export class ClickHouseHighThroughputAnalyticsDriverPipeline {
  private guardrails: ClickHouseHighThroughputAnalyticsDriverGuardrails;
  private adapter: ClickHouseHighThroughputAnalyticsDriverThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: ClickHouseHighThroughputAnalyticsDriverThirdPartyAdapter) {
    this.guardrails = new ClickHouseHighThroughputAnalyticsDriverGuardrails();
    this.adapter = adapter || new ClickHouseHighThroughputAnalyticsDriverThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    // Stage 1: Guardrail & Rate Limiting
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[ClickHouse High-Throughput Analytics Driver Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

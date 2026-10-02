/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Apache Doris Real-time Fast Analytics Warehouse.
 * @module @cmox/plugin-doris-analytics-warehouse/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { ApacheDorisRealtimeFastAnalyticsWarehouseGuardrails } from './guardrails';
import { ApacheDorisRealtimeFastAnalyticsWarehouseThirdPartyAdapter } from './adapter';

export class ApacheDorisRealtimeFastAnalyticsWarehousePipeline {
  private guardrails: ApacheDorisRealtimeFastAnalyticsWarehouseGuardrails;
  private adapter: ApacheDorisRealtimeFastAnalyticsWarehouseThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: ApacheDorisRealtimeFastAnalyticsWarehouseThirdPartyAdapter) {
    this.guardrails = new ApacheDorisRealtimeFastAnalyticsWarehouseGuardrails();
    this.adapter = adapter || new ApacheDorisRealtimeFastAnalyticsWarehouseThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Apache Doris Real-time Fast Analytics Warehouse Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

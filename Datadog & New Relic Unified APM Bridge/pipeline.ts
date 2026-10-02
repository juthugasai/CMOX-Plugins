/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Datadog & New Relic Unified APM Bridge.
 * @module @cmox/plugin-datadog-apm/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { DatadogNewRelicUnifiedAPMBridgeGuardrails } from './guardrails';
import { DatadogNewRelicUnifiedAPMBridgeThirdPartyAdapter } from './adapter';

export class DatadogNewRelicUnifiedAPMBridgePipeline {
  private guardrails: DatadogNewRelicUnifiedAPMBridgeGuardrails;
  private adapter: DatadogNewRelicUnifiedAPMBridgeThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: DatadogNewRelicUnifiedAPMBridgeThirdPartyAdapter) {
    this.guardrails = new DatadogNewRelicUnifiedAPMBridgeGuardrails();
    this.adapter = adapter || new DatadogNewRelicUnifiedAPMBridgeThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Datadog & New Relic Unified APM Bridge Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

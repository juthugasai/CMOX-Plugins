/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Predictive Intelligent Cache Warmer.
 * @module @cmox/plugin-predictive-cache-warmer/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { PredictiveIntelligentCacheWarmerGuardrails } from './guardrails';
import { PredictiveIntelligentCacheWarmerThirdPartyAdapter } from './adapter';

export class PredictiveIntelligentCacheWarmerPipeline {
  private guardrails: PredictiveIntelligentCacheWarmerGuardrails;
  private adapter: PredictiveIntelligentCacheWarmerThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: PredictiveIntelligentCacheWarmerThirdPartyAdapter) {
    this.guardrails = new PredictiveIntelligentCacheWarmerGuardrails();
    this.adapter = adapter || new PredictiveIntelligentCacheWarmerThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Predictive Intelligent Cache Warmer Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

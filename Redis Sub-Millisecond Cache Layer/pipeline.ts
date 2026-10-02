/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Redis Sub-Millisecond Cache Layer.
 * @module @cmox/plugin-redis-cache/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { RedisSubMillisecondCacheLayerGuardrails } from './guardrails';
import { RedisSubMillisecondCacheLayerThirdPartyAdapter } from './adapter';

export class RedisSubMillisecondCacheLayerPipeline {
  private guardrails: RedisSubMillisecondCacheLayerGuardrails;
  private adapter: RedisSubMillisecondCacheLayerThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: RedisSubMillisecondCacheLayerThirdPartyAdapter) {
    this.guardrails = new RedisSubMillisecondCacheLayerGuardrails();
    this.adapter = adapter || new RedisSubMillisecondCacheLayerThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Redis Sub-Millisecond Cache Layer Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

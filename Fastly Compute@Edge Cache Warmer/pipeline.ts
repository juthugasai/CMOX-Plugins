/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Fastly Compute@Edge Cache Warmer.
 * @module @cmox/plugin-fastly-compute-warmer/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { FastlyComputeEdgeCacheWarmerGuardrails } from './guardrails';
import { FastlyComputeEdgeCacheWarmerThirdPartyAdapter } from './adapter';

export class FastlyComputeEdgeCacheWarmerPipeline {
  private guardrails: FastlyComputeEdgeCacheWarmerGuardrails;
  private adapter: FastlyComputeEdgeCacheWarmerThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: FastlyComputeEdgeCacheWarmerThirdPartyAdapter) {
    this.guardrails = new FastlyComputeEdgeCacheWarmerGuardrails();
    this.adapter = adapter || new FastlyComputeEdgeCacheWarmerThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Fastly Compute@Edge Cache Warmer Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

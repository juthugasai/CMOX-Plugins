/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Vercel Edge Serverless Cache Invalidator.
 * @module @cmox/plugin-vercel-cache-invalidator/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { VercelEdgeServerlessCacheInvalidatorGuardrails } from './guardrails';
import { VercelEdgeServerlessCacheInvalidatorThirdPartyAdapter } from './adapter';

export class VercelEdgeServerlessCacheInvalidatorPipeline {
  private guardrails: VercelEdgeServerlessCacheInvalidatorGuardrails;
  private adapter: VercelEdgeServerlessCacheInvalidatorThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: VercelEdgeServerlessCacheInvalidatorThirdPartyAdapter) {
    this.guardrails = new VercelEdgeServerlessCacheInvalidatorGuardrails();
    this.adapter = adapter || new VercelEdgeServerlessCacheInvalidatorThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Vercel Edge Serverless Cache Invalidator Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

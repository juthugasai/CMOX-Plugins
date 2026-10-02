/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for AI Hub.
 * @module @cmox/plugin-ai-hub/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { AIHubGuardrails } from './guardrails';
import { AIHubThirdPartyAdapter } from './adapter';

export class AIHubPipeline {
  private guardrails: AIHubGuardrails;
  private adapter: AIHubThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: AIHubThirdPartyAdapter) {
    this.guardrails = new AIHubGuardrails();
    this.adapter = adapter || new AIHubThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[AI Hub Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

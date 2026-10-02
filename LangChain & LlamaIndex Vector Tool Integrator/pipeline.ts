/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for LangChain & LlamaIndex Vector Tool Integrator.
 * @module @cmox/plugin-langchain-tools/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { LangChainLlamaIndexVectorToolIntegratorGuardrails } from './guardrails';
import { LangChainLlamaIndexVectorToolIntegratorThirdPartyAdapter } from './adapter';

export class LangChainLlamaIndexVectorToolIntegratorPipeline {
  private guardrails: LangChainLlamaIndexVectorToolIntegratorGuardrails;
  private adapter: LangChainLlamaIndexVectorToolIntegratorThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: LangChainLlamaIndexVectorToolIntegratorThirdPartyAdapter) {
    this.guardrails = new LangChainLlamaIndexVectorToolIntegratorGuardrails();
    this.adapter = adapter || new LangChainLlamaIndexVectorToolIntegratorThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[LangChain & LlamaIndex Vector Tool Integrator Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

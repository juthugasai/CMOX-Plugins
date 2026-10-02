/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Ollama Local LLM Database Assistant.
 * @module @cmox/plugin-ollama-local-llm/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { OllamaLocalLLMDatabaseAssistantGuardrails } from './guardrails';

export class OllamaLocalLLMDatabaseAssistantPipeline {
  private guardrails: OllamaLocalLLMDatabaseAssistantGuardrails;
  private sequenceCounter: number = 0;

  constructor() {
    this.guardrails = new OllamaLocalLLMDatabaseAssistantGuardrails();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    // Stage 1: Guardrail & Rate Limiting
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Ollama Local LLM Database Assistant Pipeline] Validation failed: ${validation.errors.join(', ')}`);
    }

    // Stage 2: Normalization & Sequencing
    this.sequenceCounter++;
    const payloadJson = JSON.stringify(validation.sanitizedData);

    // Stage 3: Cryptographic Integrity Checksum (SHA-256)
    const checksum = createHash('sha256').update(payloadJson).digest('hex');

    // Stage 4: Envelope Construction
    return {
      id: `evt_${Date.now()}_${this.sequenceCounter}`,
      sequence: this.sequenceCounter,
      timestamp: Date.now(),
      source,
      action,
      data: validation.sanitizedData,
      checksumSha256: checksum
    };
  }
}

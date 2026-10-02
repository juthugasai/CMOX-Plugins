/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for AI Synthetic Mock Data Generator.
 * @module @cmox/plugin-synthetic-data-generator/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { AISyntheticMockDataGeneratorGuardrails } from './guardrails';
import { AISyntheticMockDataGeneratorThirdPartyAdapter } from './adapter';

export class AISyntheticMockDataGeneratorPipeline {
  private guardrails: AISyntheticMockDataGeneratorGuardrails;
  private adapter: AISyntheticMockDataGeneratorThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: AISyntheticMockDataGeneratorThirdPartyAdapter) {
    this.guardrails = new AISyntheticMockDataGeneratorGuardrails();
    this.adapter = adapter || new AISyntheticMockDataGeneratorThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    // Stage 1: Guardrail & Rate Limiting
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[AI Synthetic Mock Data Generator Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

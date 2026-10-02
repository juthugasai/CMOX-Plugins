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
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[AI Synthetic Mock Data Generator Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

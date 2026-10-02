/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Prisma, Drizzle & TypeORM Model Generator.
 * @module @cmox/plugin-orm-models-generator/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { PrismaDrizzleTypeORMModelGeneratorGuardrails } from './guardrails';
import { PrismaDrizzleTypeORMModelGeneratorThirdPartyAdapter } from './adapter';

export class PrismaDrizzleTypeORMModelGeneratorPipeline {
  private guardrails: PrismaDrizzleTypeORMModelGeneratorGuardrails;
  private adapter: PrismaDrizzleTypeORMModelGeneratorThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: PrismaDrizzleTypeORMModelGeneratorThirdPartyAdapter) {
    this.guardrails = new PrismaDrizzleTypeORMModelGeneratorGuardrails();
    this.adapter = adapter || new PrismaDrizzleTypeORMModelGeneratorThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Prisma, Drizzle & TypeORM Model Generator Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

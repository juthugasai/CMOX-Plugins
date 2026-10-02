/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Legacy Oracle to CMOX Migration Pipeline.
 * @module @cmox/plugin-oracle-migration-tool/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { LegacyOracletoCMOXMigrationPipelineGuardrails } from './guardrails';
import { LegacyOracletoCMOXMigrationPipelineThirdPartyAdapter } from './adapter';

export class LegacyOracletoCMOXMigrationPipelinePipeline {
  private guardrails: LegacyOracletoCMOXMigrationPipelineGuardrails;
  private adapter: LegacyOracletoCMOXMigrationPipelineThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: LegacyOracletoCMOXMigrationPipelineThirdPartyAdapter) {
    this.guardrails = new LegacyOracletoCMOXMigrationPipelineGuardrails();
    this.adapter = adapter || new LegacyOracletoCMOXMigrationPipelineThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Legacy Oracle to CMOX Migration Pipeline Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

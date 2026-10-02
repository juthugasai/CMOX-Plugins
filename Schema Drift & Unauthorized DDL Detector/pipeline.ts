/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Schema Drift & Unauthorized DDL Detector.
 * @module @cmox/plugin-schema-drift-detector/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { SchemaDriftUnauthorizedDDLDetectorGuardrails } from './guardrails';
import { SchemaDriftUnauthorizedDDLDetectorThirdPartyAdapter } from './adapter';

export class SchemaDriftUnauthorizedDDLDetectorPipeline {
  private guardrails: SchemaDriftUnauthorizedDDLDetectorGuardrails;
  private adapter: SchemaDriftUnauthorizedDDLDetectorThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: SchemaDriftUnauthorizedDDLDetectorThirdPartyAdapter) {
    this.guardrails = new SchemaDriftUnauthorizedDDLDetectorGuardrails();
    this.adapter = adapter || new SchemaDriftUnauthorizedDDLDetectorThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Schema Drift & Unauthorized DDL Detector Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

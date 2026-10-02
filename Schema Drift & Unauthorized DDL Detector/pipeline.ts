/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Schema Drift & Unauthorized DDL Detector.
 * @module @cmox/plugin-schema-drift-detector/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { SchemaDriftUnauthorizedDDLDetectorGuardrails } from './guardrails';

export class SchemaDriftUnauthorizedDDLDetectorPipeline {
  private guardrails: SchemaDriftUnauthorizedDDLDetectorGuardrails;
  private sequenceCounter: number = 0;

  constructor() {
    this.guardrails = new SchemaDriftUnauthorizedDDLDetectorGuardrails();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    // Stage 1: Guardrail & Rate Limiting
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Schema Drift & Unauthorized DDL Detector Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for JSON / BSON Document Schema Validator.
 * @module @cmox/plugin-json-validator/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { JSONBSONDocumentSchemaValidatorGuardrails } from './guardrails';
import { JSONBSONDocumentSchemaValidatorThirdPartyAdapter } from './adapter';

export class JSONBSONDocumentSchemaValidatorPipeline {
  private guardrails: JSONBSONDocumentSchemaValidatorGuardrails;
  private adapter: JSONBSONDocumentSchemaValidatorThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: JSONBSONDocumentSchemaValidatorThirdPartyAdapter) {
    this.guardrails = new JSONBSONDocumentSchemaValidatorGuardrails();
    this.adapter = adapter || new JSONBSONDocumentSchemaValidatorThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[JSON / BSON Document Schema Validator Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

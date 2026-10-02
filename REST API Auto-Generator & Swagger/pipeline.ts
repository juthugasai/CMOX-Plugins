/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for REST API Auto-Generator & Swagger.
 * @module @cmox/plugin-rest-generator/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { RESTAPIAutoGeneratorSwaggerGuardrails } from './guardrails';
import { RESTAPIAutoGeneratorSwaggerThirdPartyAdapter } from './adapter';

export class RESTAPIAutoGeneratorSwaggerPipeline {
  private guardrails: RESTAPIAutoGeneratorSwaggerGuardrails;
  private adapter: RESTAPIAutoGeneratorSwaggerThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: RESTAPIAutoGeneratorSwaggerThirdPartyAdapter) {
    this.guardrails = new RESTAPIAutoGeneratorSwaggerGuardrails();
    this.adapter = adapter || new RESTAPIAutoGeneratorSwaggerThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    // Stage 1: Guardrail & Rate Limiting
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[REST API Auto-Generator & Swagger Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

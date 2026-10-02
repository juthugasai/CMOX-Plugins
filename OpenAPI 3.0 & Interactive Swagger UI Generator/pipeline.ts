/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for OpenAPI 3.0 & Interactive Swagger UI Generator.
 * @module @cmox/plugin-swagger-openapi-ui/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { OpenAPI30InteractiveSwaggerUIGeneratorGuardrails } from './guardrails';
import { OpenAPI30InteractiveSwaggerUIGeneratorThirdPartyAdapter } from './adapter';

export class OpenAPI30InteractiveSwaggerUIGeneratorPipeline {
  private guardrails: OpenAPI30InteractiveSwaggerUIGeneratorGuardrails;
  private adapter: OpenAPI30InteractiveSwaggerUIGeneratorThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: OpenAPI30InteractiveSwaggerUIGeneratorThirdPartyAdapter) {
    this.guardrails = new OpenAPI30InteractiveSwaggerUIGeneratorGuardrails();
    this.adapter = adapter || new OpenAPI30InteractiveSwaggerUIGeneratorThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    // Stage 1: Guardrail & Rate Limiting
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[OpenAPI 3.0 & Interactive Swagger UI Generator Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

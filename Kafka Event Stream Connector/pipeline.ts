/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Kafka Event Stream Connector.
 * @module @cmox/plugin-kafka-connector/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { KafkaEventStreamConnectorGuardrails } from './guardrails';

export class KafkaEventStreamConnectorPipeline {
  private guardrails: KafkaEventStreamConnectorGuardrails;
  private sequenceCounter: number = 0;

  constructor() {
    this.guardrails = new KafkaEventStreamConnectorGuardrails();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    // Stage 1: Guardrail & Rate Limiting
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Kafka Event Stream Connector Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

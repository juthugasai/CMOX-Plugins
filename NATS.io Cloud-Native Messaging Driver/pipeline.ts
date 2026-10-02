/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for NATS.io Cloud-Native Messaging Driver.
 * @module @cmox/plugin-nats-messaging/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { NATSioCloudNativeMessagingDriverGuardrails } from './guardrails';
import { NATSioCloudNativeMessagingDriverThirdPartyAdapter } from './adapter';

export class NATSioCloudNativeMessagingDriverPipeline {
  private guardrails: NATSioCloudNativeMessagingDriverGuardrails;
  private adapter: NATSioCloudNativeMessagingDriverThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: NATSioCloudNativeMessagingDriverThirdPartyAdapter) {
    this.guardrails = new NATSioCloudNativeMessagingDriverGuardrails();
    this.adapter = adapter || new NATSioCloudNativeMessagingDriverThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    // Stage 1: Guardrail & Rate Limiting
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[NATS.io Cloud-Native Messaging Driver Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

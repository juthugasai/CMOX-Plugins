/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Notion Database 2-Way Sync Bridge.
 * @module @cmox/plugin-notion-bridge/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { NotionDatabase2WaySyncBridgeGuardrails } from './guardrails';
import { NotionDatabase2WaySyncBridgeThirdPartyAdapter } from './adapter';

export class NotionDatabase2WaySyncBridgePipeline {
  private guardrails: NotionDatabase2WaySyncBridgeGuardrails;
  private adapter: NotionDatabase2WaySyncBridgeThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: NotionDatabase2WaySyncBridgeThirdPartyAdapter) {
    this.guardrails = new NotionDatabase2WaySyncBridgeGuardrails();
    this.adapter = adapter || new NotionDatabase2WaySyncBridgeThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    // Stage 1: Guardrail & Rate Limiting
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Notion Database 2-Way Sync Bridge Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

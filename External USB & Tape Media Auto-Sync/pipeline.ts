/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for External USB & Tape Media Auto-Sync.
 * @module @cmox/plugin-usb-auto-sync/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { ExternalUSBTapeMediaAutoSyncGuardrails } from './guardrails';
import { ExternalUSBTapeMediaAutoSyncThirdPartyAdapter } from './adapter';

export class ExternalUSBTapeMediaAutoSyncPipeline {
  private guardrails: ExternalUSBTapeMediaAutoSyncGuardrails;
  private adapter: ExternalUSBTapeMediaAutoSyncThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: ExternalUSBTapeMediaAutoSyncThirdPartyAdapter) {
    this.guardrails = new ExternalUSBTapeMediaAutoSyncGuardrails();
    this.adapter = adapter || new ExternalUSBTapeMediaAutoSyncThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[External USB & Tape Media Auto-Sync Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

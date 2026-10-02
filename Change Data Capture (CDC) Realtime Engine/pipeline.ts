/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Change Data Capture (CDC) Realtime Engine.
 * @module @cmox/plugin-change-data-capture/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { ChangeDataCaptureCDCRealtimeEngineGuardrails } from './guardrails';
import { ChangeDataCaptureCDCRealtimeEngineThirdPartyAdapter } from './adapter';

export class ChangeDataCaptureCDCRealtimeEnginePipeline {
  private guardrails: ChangeDataCaptureCDCRealtimeEngineGuardrails;
  private adapter: ChangeDataCaptureCDCRealtimeEngineThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: ChangeDataCaptureCDCRealtimeEngineThirdPartyAdapter) {
    this.guardrails = new ChangeDataCaptureCDCRealtimeEngineGuardrails();
    this.adapter = adapter || new ChangeDataCaptureCDCRealtimeEngineThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Change Data Capture (CDC) Realtime Engine Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

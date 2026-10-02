/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Supabase Realtime WebSocket Replicator.
 * @module @cmox/plugin-supabase-replicator/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { SupabaseRealtimeWebSocketReplicatorGuardrails } from './guardrails';
import { SupabaseRealtimeWebSocketReplicatorThirdPartyAdapter } from './adapter';

export class SupabaseRealtimeWebSocketReplicatorPipeline {
  private guardrails: SupabaseRealtimeWebSocketReplicatorGuardrails;
  private adapter: SupabaseRealtimeWebSocketReplicatorThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: SupabaseRealtimeWebSocketReplicatorThirdPartyAdapter) {
    this.guardrails = new SupabaseRealtimeWebSocketReplicatorGuardrails();
    this.adapter = adapter || new SupabaseRealtimeWebSocketReplicatorThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    // Stage 1: Guardrail & Rate Limiting
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Supabase Realtime WebSocket Replicator Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

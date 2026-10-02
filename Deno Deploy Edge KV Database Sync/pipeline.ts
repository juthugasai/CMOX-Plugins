/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Deno Deploy Edge KV Database Sync.
 * @module @cmox/plugin-deno-deploy-kv-sync/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { DenoDeployEdgeKVDatabaseSyncGuardrails } from './guardrails';
import { DenoDeployEdgeKVDatabaseSyncThirdPartyAdapter } from './adapter';

export class DenoDeployEdgeKVDatabaseSyncPipeline {
  private guardrails: DenoDeployEdgeKVDatabaseSyncGuardrails;
  private adapter: DenoDeployEdgeKVDatabaseSyncThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: DenoDeployEdgeKVDatabaseSyncThirdPartyAdapter) {
    this.guardrails = new DenoDeployEdgeKVDatabaseSyncGuardrails();
    this.adapter = adapter || new DenoDeployEdgeKVDatabaseSyncThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Deno Deploy Edge KV Database Sync Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

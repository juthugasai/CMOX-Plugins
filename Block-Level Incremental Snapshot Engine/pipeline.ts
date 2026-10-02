/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Block-Level Incremental Snapshot Engine.
 * @module @cmox/plugin-incremental-backup/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { BlockLevelIncrementalSnapshotEngineGuardrails } from './guardrails';
import { BlockLevelIncrementalSnapshotEngineThirdPartyAdapter } from './adapter';

export class BlockLevelIncrementalSnapshotEnginePipeline {
  private guardrails: BlockLevelIncrementalSnapshotEngineGuardrails;
  private adapter: BlockLevelIncrementalSnapshotEngineThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: BlockLevelIncrementalSnapshotEngineThirdPartyAdapter) {
    this.guardrails = new BlockLevelIncrementalSnapshotEngineGuardrails();
    this.adapter = adapter || new BlockLevelIncrementalSnapshotEngineThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Block-Level Incremental Snapshot Engine Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

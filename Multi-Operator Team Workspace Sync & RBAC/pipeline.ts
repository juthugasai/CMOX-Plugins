/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Multi-Operator Team Workspace Sync & RBAC.
 * @module @cmox/plugin-team-workspace-rbac/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { MultiOperatorTeamWorkspaceSyncRBACGuardrails } from './guardrails';
import { MultiOperatorTeamWorkspaceSyncRBACThirdPartyAdapter } from './adapter';

export class MultiOperatorTeamWorkspaceSyncRBACPipeline {
  private guardrails: MultiOperatorTeamWorkspaceSyncRBACGuardrails;
  private adapter: MultiOperatorTeamWorkspaceSyncRBACThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: MultiOperatorTeamWorkspaceSyncRBACThirdPartyAdapter) {
    this.guardrails = new MultiOperatorTeamWorkspaceSyncRBACGuardrails();
    this.adapter = adapter || new MultiOperatorTeamWorkspaceSyncRBACThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Multi-Operator Team Workspace Sync & RBAC Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

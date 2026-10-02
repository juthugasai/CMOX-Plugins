/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Automated DR Failover Orchestrator.
 * @module @cmox/plugin-auto-failover/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { AutomatedDRFailoverOrchestratorGuardrails } from './guardrails';
import { AutomatedDRFailoverOrchestratorThirdPartyAdapter } from './adapter';

export class AutomatedDRFailoverOrchestratorPipeline {
  private guardrails: AutomatedDRFailoverOrchestratorGuardrails;
  private adapter: AutomatedDRFailoverOrchestratorThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: AutomatedDRFailoverOrchestratorThirdPartyAdapter) {
    this.guardrails = new AutomatedDRFailoverOrchestratorGuardrails();
    this.adapter = adapter || new AutomatedDRFailoverOrchestratorThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Automated DR Failover Orchestrator Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

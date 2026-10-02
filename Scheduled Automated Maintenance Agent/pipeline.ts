/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Scheduled Automated Maintenance Agent.
 * @module @cmox/plugin-auto-maintenance-agent/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { ScheduledAutomatedMaintenanceAgentGuardrails } from './guardrails';
import { ScheduledAutomatedMaintenanceAgentThirdPartyAdapter } from './adapter';

export class ScheduledAutomatedMaintenanceAgentPipeline {
  private guardrails: ScheduledAutomatedMaintenanceAgentGuardrails;
  private adapter: ScheduledAutomatedMaintenanceAgentThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: ScheduledAutomatedMaintenanceAgentThirdPartyAdapter) {
    this.guardrails = new ScheduledAutomatedMaintenanceAgentGuardrails();
    this.adapter = adapter || new ScheduledAutomatedMaintenanceAgentThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Scheduled Automated Maintenance Agent Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

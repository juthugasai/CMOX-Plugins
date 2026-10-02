/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for PagerDuty & OpsGenie Incident Dispatcher.
 * @module @cmox/plugin-pagerduty-dispatcher/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { PagerDutyOpsGenieIncidentDispatcherGuardrails } from './guardrails';
import { PagerDutyOpsGenieIncidentDispatcherThirdPartyAdapter } from './adapter';

export class PagerDutyOpsGenieIncidentDispatcherPipeline {
  private guardrails: PagerDutyOpsGenieIncidentDispatcherGuardrails;
  private adapter: PagerDutyOpsGenieIncidentDispatcherThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: PagerDutyOpsGenieIncidentDispatcherThirdPartyAdapter) {
    this.guardrails = new PagerDutyOpsGenieIncidentDispatcherGuardrails();
    this.adapter = adapter || new PagerDutyOpsGenieIncidentDispatcherThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    // Stage 1: Guardrail & Rate Limiting
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[PagerDuty & OpsGenie Incident Dispatcher Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

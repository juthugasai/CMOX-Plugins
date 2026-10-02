/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Sub-Second Point-in-Time Recovery (PITR).
 * @module @cmox/plugin-pitr-recovery/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { SubSecondPointinTimeRecoveryPITRGuardrails } from './guardrails';
import { SubSecondPointinTimeRecoveryPITRThirdPartyAdapter } from './adapter';

export class SubSecondPointinTimeRecoveryPITRPipeline {
  private guardrails: SubSecondPointinTimeRecoveryPITRGuardrails;
  private adapter: SubSecondPointinTimeRecoveryPITRThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: SubSecondPointinTimeRecoveryPITRThirdPartyAdapter) {
    this.guardrails = new SubSecondPointinTimeRecoveryPITRGuardrails();
    this.adapter = adapter || new SubSecondPointinTimeRecoveryPITRThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    // Stage 1: Guardrail & Rate Limiting
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Sub-Second Point-in-Time Recovery (PITR) Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

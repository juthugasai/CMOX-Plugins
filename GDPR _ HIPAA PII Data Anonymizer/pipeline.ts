/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for GDPR / HIPAA PII Data Anonymizer.
 * @module @cmox/plugin-gdpr-anonymizer/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { GDPRHIPAAPIIDataAnonymizerGuardrails } from './guardrails';
import { GDPRHIPAAPIIDataAnonymizerThirdPartyAdapter } from './adapter';

export class GDPRHIPAAPIIDataAnonymizerPipeline {
  private guardrails: GDPRHIPAAPIIDataAnonymizerGuardrails;
  private adapter: GDPRHIPAAPIIDataAnonymizerThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: GDPRHIPAAPIIDataAnonymizerThirdPartyAdapter) {
    this.guardrails = new GDPRHIPAAPIIDataAnonymizerGuardrails();
    this.adapter = adapter || new GDPRHIPAAPIIDataAnonymizerThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[GDPR / HIPAA PII Data Anonymizer Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

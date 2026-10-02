/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Data Quality & Null Integrity Assertion Suite.
 * @module @cmox/plugin-data-quality-assertions/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { DataQualityNullIntegrityAssertionSuiteGuardrails } from './guardrails';
import { DataQualityNullIntegrityAssertionSuiteThirdPartyAdapter } from './adapter';

export class DataQualityNullIntegrityAssertionSuitePipeline {
  private guardrails: DataQualityNullIntegrityAssertionSuiteGuardrails;
  private adapter: DataQualityNullIntegrityAssertionSuiteThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: DataQualityNullIntegrityAssertionSuiteThirdPartyAdapter) {
    this.guardrails = new DataQualityNullIntegrityAssertionSuiteGuardrails();
    this.adapter = adapter || new DataQualityNullIntegrityAssertionSuiteThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Data Quality & Null Integrity Assertion Suite Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

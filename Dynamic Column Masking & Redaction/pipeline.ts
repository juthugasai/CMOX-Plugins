/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Dynamic Column Masking & Redaction.
 * @module @cmox/plugin-dynamic-column-masking/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { DynamicColumnMaskingRedactionGuardrails } from './guardrails';
import { DynamicColumnMaskingRedactionThirdPartyAdapter } from './adapter';

export class DynamicColumnMaskingRedactionPipeline {
  private guardrails: DynamicColumnMaskingRedactionGuardrails;
  private adapter: DynamicColumnMaskingRedactionThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: DynamicColumnMaskingRedactionThirdPartyAdapter) {
    this.guardrails = new DynamicColumnMaskingRedactionGuardrails();
    this.adapter = adapter || new DynamicColumnMaskingRedactionThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Dynamic Column Masking & Redaction Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

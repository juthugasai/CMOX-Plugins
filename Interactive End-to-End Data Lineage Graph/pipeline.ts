/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Interactive End-to-End Data Lineage Graph.
 * @module @cmox/plugin-data-lineage-graph/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { InteractiveEndtoEndDataLineageGraphGuardrails } from './guardrails';
import { InteractiveEndtoEndDataLineageGraphThirdPartyAdapter } from './adapter';

export class InteractiveEndtoEndDataLineageGraphPipeline {
  private guardrails: InteractiveEndtoEndDataLineageGraphGuardrails;
  private adapter: InteractiveEndtoEndDataLineageGraphThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: InteractiveEndtoEndDataLineageGraphThirdPartyAdapter) {
    this.guardrails = new InteractiveEndtoEndDataLineageGraphGuardrails();
    this.adapter = adapter || new InteractiveEndtoEndDataLineageGraphThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Interactive End-to-End Data Lineage Graph Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

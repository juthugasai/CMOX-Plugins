/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Presto / Trino SQL Query Federation Layer.
 * @module @cmox/plugin-trino-query-federation/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { PrestoTrinoSQLQueryFederationLayerGuardrails } from './guardrails';
import { PrestoTrinoSQLQueryFederationLayerThirdPartyAdapter } from './adapter';

export class PrestoTrinoSQLQueryFederationLayerPipeline {
  private guardrails: PrestoTrinoSQLQueryFederationLayerGuardrails;
  private adapter: PrestoTrinoSQLQueryFederationLayerThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: PrestoTrinoSQLQueryFederationLayerThirdPartyAdapter) {
    this.guardrails = new PrestoTrinoSQLQueryFederationLayerGuardrails();
    this.adapter = adapter || new PrestoTrinoSQLQueryFederationLayerThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Presto / Trino SQL Query Federation Layer Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Air-Gapped Cold Storage Vault.
 * @module @cmox/plugin-air-gap-vault/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { AirGappedColdStorageVaultGuardrails } from './guardrails';
import { AirGappedColdStorageVaultThirdPartyAdapter } from './adapter';

export class AirGappedColdStorageVaultPipeline {
  private guardrails: AirGappedColdStorageVaultGuardrails;
  private adapter: AirGappedColdStorageVaultThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: AirGappedColdStorageVaultThirdPartyAdapter) {
    this.guardrails = new AirGappedColdStorageVaultGuardrails();
    this.adapter = adapter || new AirGappedColdStorageVaultThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Air-Gapped Cold Storage Vault Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

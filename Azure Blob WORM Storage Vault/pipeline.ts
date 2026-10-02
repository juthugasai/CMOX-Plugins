/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Azure Blob WORM Storage Vault.
 * @module @cmox/plugin-azure-blob-vault/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { AzureBlobWORMStorageVaultGuardrails } from './guardrails';
import { AzureBlobWORMStorageVaultThirdPartyAdapter } from './adapter';

export class AzureBlobWORMStorageVaultPipeline {
  private guardrails: AzureBlobWORMStorageVaultGuardrails;
  private adapter: AzureBlobWORMStorageVaultThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: AzureBlobWORMStorageVaultThirdPartyAdapter) {
    this.guardrails = new AzureBlobWORMStorageVaultGuardrails();
    this.adapter = adapter || new AzureBlobWORMStorageVaultThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Azure Blob WORM Storage Vault Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

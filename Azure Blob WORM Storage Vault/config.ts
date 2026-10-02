/**
 * @file config.ts
 * @description Configuration parser, schema validator, and environment resolver for Azure Blob WORM Storage Vault.
 * @module @cmox/plugin-azure-blob-vault/config
 */

import { AzureBlobWORMStorageVaultEngineConfig, PluginLogLevel } from './types';

export class AzureBlobWORMStorageVaultConfigManager {
  private config: AzureBlobWORMStorageVaultEngineConfig;

  constructor(custom?: Partial<AzureBlobWORMStorageVaultEngineConfig>) {
    this.config = this.resolveDefaults(custom);
    this.validate();
  }

  private resolveDefaults(custom?: Partial<AzureBlobWORMStorageVaultEngineConfig>): AzureBlobWORMStorageVaultEngineConfig {
    const envPrefix = 'CMOX_PLUGIN_AZURE_BLOB_VAULT_';

    return {
      enabled: custom?.enabled ?? (process.env[`${envPrefix}ENABLED`] ? process.env[`${envPrefix}ENABLED`] !== 'false' : false),
      autoUpdate: custom?.autoUpdate ?? (process.env[`${envPrefix}AUTO_UPDATE`] ? process.env[`${envPrefix}AUTO_UPDATE`] !== 'false' : true),
      endpoint: custom?.endpoint || process.env[`${envPrefix}ENDPOINT`] || "https://cmoxbackup.blob.core.windows.net",
      apiKey: custom?.apiKey || process.env[`${envPrefix}API_KEY`] || "",
      logLevel: (custom?.logLevel || process.env[`${envPrefix}LOG_LEVEL`] || 'info') as PluginLogLevel,
      syncIntervalSec: custom?.syncIntervalSec ?? (Number(process.env[`${envPrefix}SYNC_INTERVAL`]) || 10),
      maxBatchSize: custom?.maxBatchSize ?? (Number(process.env[`${envPrefix}MAX_BATCH_SIZE`]) || 250),
      timeoutMs: custom?.timeoutMs ?? (Number(process.env[`${envPrefix}TIMEOUT_MS`]) || 5000),
      retryAttempts: custom?.retryAttempts ?? 3,
      connectionPoolSize: custom?.connectionPoolSize ?? 8,
      backpressureThreshold: custom?.backpressureThreshold ?? 10000,
      enableEncryption: custom?.enableEncryption ?? true,
      bridgePort: custom?.bridgePort ?? (Number(process.env[`${envPrefix}BRIDGE_PORT`]) || 7890),
      webhookUrl: custom?.webhookUrl || process.env[`${envPrefix}WEBHOOK_URL`] || 'https://api.cmox.io/v1/plugins/azure-blob-vault/webhook',
      webhookSecret: custom?.webhookSecret || process.env[`${envPrefix}WEBHOOK_SECRET`] || 'cmox_sec_live_default_key',
      param1: custom?.param1 || process.env[`${envPrefix}PARAM1`] || "immutable-vault",
      param2: custom?.param2 || process.env[`${envPrefix}PARAM2`] || "true",
      customOptions: custom?.customOptions || {}
    };
  }

  public get(): AzureBlobWORMStorageVaultEngineConfig {
    return { ...this.config };
  }

  public update(patch: Partial<AzureBlobWORMStorageVaultEngineConfig>): AzureBlobWORMStorageVaultEngineConfig {
    this.config = { ...this.config, ...patch };
    this.validate();
    return this.get();
  }

  public validate(): boolean {
    if (this.config.syncIntervalSec < 1) {
      throw new Error('[Azure Blob WORM Storage Vault] syncIntervalSec must be at least 1 second.');
    }
    if (this.config.maxBatchSize < 1 || this.config.maxBatchSize > 50000) {
      throw new Error('[Azure Blob WORM Storage Vault] maxBatchSize must be between 1 and 50,000.');
    }
    return true;
  }
}

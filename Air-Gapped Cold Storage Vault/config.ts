/**
 * @file config.ts
 * @description Configuration parser, schema validator, and environment resolver for Air-Gapped Cold Storage Vault.
 * @module @cmox/plugin-air-gap-vault/config
 */

import { AirGappedColdStorageVaultEngineConfig, PluginLogLevel } from './types';

export class AirGappedColdStorageVaultConfigManager {
  private config: AirGappedColdStorageVaultEngineConfig;

  constructor(custom?: Partial<AirGappedColdStorageVaultEngineConfig>) {
    this.config = this.resolveDefaults(custom);
    this.validate();
  }

  private resolveDefaults(custom?: Partial<AirGappedColdStorageVaultEngineConfig>): AirGappedColdStorageVaultEngineConfig {
    const envPrefix = 'CMOX_PLUGIN_AIR_GAP_VAULT_';

    return {
      enabled: custom?.enabled ?? (process.env[`${envPrefix}ENABLED`] ? process.env[`${envPrefix}ENABLED`] !== 'false' : false),
      autoUpdate: custom?.autoUpdate ?? (process.env[`${envPrefix}AUTO_UPDATE`] ? process.env[`${envPrefix}AUTO_UPDATE`] !== 'false' : false),
      endpoint: custom?.endpoint || process.env[`${envPrefix}ENDPOINT`] || "http://localhost:9092",
      apiKey: custom?.apiKey || process.env[`${envPrefix}API_KEY`] || "",
      logLevel: (custom?.logLevel || process.env[`${envPrefix}LOG_LEVEL`] || 'warn') as PluginLogLevel,
      syncIntervalSec: custom?.syncIntervalSec ?? (Number(process.env[`${envPrefix}SYNC_INTERVAL`]) || 10),
      maxBatchSize: custom?.maxBatchSize ?? (Number(process.env[`${envPrefix}MAX_BATCH_SIZE`]) || 250),
      timeoutMs: custom?.timeoutMs ?? (Number(process.env[`${envPrefix}TIMEOUT_MS`]) || 5000),
      retryAttempts: custom?.retryAttempts ?? 3,
      connectionPoolSize: custom?.connectionPoolSize ?? 8,
      backpressureThreshold: custom?.backpressureThreshold ?? 10000,
      enableEncryption: custom?.enableEncryption ?? true,
      param1: custom?.param1 || process.env[`${envPrefix}PARAM1`] || "0x98A4B21F7C",
      param2: custom?.param2 || process.env[`${envPrefix}PARAM2`] || "true",
      customOptions: custom?.customOptions || {}
    };
  }

  public get(): AirGappedColdStorageVaultEngineConfig {
    return { ...this.config };
  }

  public update(patch: Partial<AirGappedColdStorageVaultEngineConfig>): AirGappedColdStorageVaultEngineConfig {
    this.config = { ...this.config, ...patch };
    this.validate();
    return this.get();
  }

  public validate(): boolean {
    if (this.config.syncIntervalSec < 1) {
      throw new Error('[Air-Gapped Cold Storage Vault] syncIntervalSec must be at least 1 second.');
    }
    if (this.config.maxBatchSize < 1 || this.config.maxBatchSize > 50000) {
      throw new Error('[Air-Gapped Cold Storage Vault] maxBatchSize must be between 1 and 50,000.');
    }
    return true;
  }
}

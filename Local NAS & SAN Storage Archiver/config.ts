/**
 * @file config.ts
 * @description Configuration parser, schema validator, and environment resolver for Local NAS & SAN Storage Archiver.
 * @module @cmox/plugin-nas-backup/config
 */

import { LocalNASSANStorageArchiverEngineConfig, PluginLogLevel } from './types';

export class LocalNASSANStorageArchiverConfigManager {
  private config: LocalNASSANStorageArchiverEngineConfig;

  constructor(custom?: Partial<LocalNASSANStorageArchiverEngineConfig>) {
    this.config = this.resolveDefaults(custom);
    this.validate();
  }

  private resolveDefaults(custom?: Partial<LocalNASSANStorageArchiverEngineConfig>): LocalNASSANStorageArchiverEngineConfig {
    const envPrefix = 'CMOX_PLUGIN_NAS_BACKUP_';

    return {
      enabled: custom?.enabled ?? (process.env[`${envPrefix}ENABLED`] ? process.env[`${envPrefix}ENABLED`] !== 'false' : true),
      autoUpdate: custom?.autoUpdate ?? (process.env[`${envPrefix}AUTO_UPDATE`] ? process.env[`${envPrefix}AUTO_UPDATE`] !== 'false' : true),
      endpoint: custom?.endpoint || process.env[`${envPrefix}ENDPOINT`] || "\\\\192.168.1.100\\Backups\\CMOX",
      apiKey: custom?.apiKey || process.env[`${envPrefix}API_KEY`] || "",
      logLevel: (custom?.logLevel || process.env[`${envPrefix}LOG_LEVEL`] || 'info') as PluginLogLevel,
      syncIntervalSec: custom?.syncIntervalSec ?? (Number(process.env[`${envPrefix}SYNC_INTERVAL`]) || 3600),
      maxBatchSize: custom?.maxBatchSize ?? (Number(process.env[`${envPrefix}MAX_BATCH_SIZE`]) || 250),
      timeoutMs: custom?.timeoutMs ?? (Number(process.env[`${envPrefix}TIMEOUT_MS`]) || 5000),
      retryAttempts: custom?.retryAttempts ?? 3,
      connectionPoolSize: custom?.connectionPoolSize ?? 8,
      backpressureThreshold: custom?.backpressureThreshold ?? 10000,
      enableEncryption: custom?.enableEncryption ?? true,
      bridgePort: custom?.bridgePort ?? (Number(process.env[`${envPrefix}BRIDGE_PORT`]) || 7890),
      webhookUrl: custom?.webhookUrl || process.env[`${envPrefix}WEBHOOK_URL`] || 'https://api.cmox.io/v1/plugins/nas-backup/webhook',
      webhookSecret: custom?.webhookSecret || process.env[`${envPrefix}WEBHOOK_SECRET`] || 'cmox_sec_live_default_key',
      param1: custom?.param1 || process.env[`${envPrefix}PARAM1`] || "30",
      param2: custom?.param2 || process.env[`${envPrefix}PARAM2`] || "zstd-level-19",
      customOptions: custom?.customOptions || {}
    };
  }

  public get(): LocalNASSANStorageArchiverEngineConfig {
    return { ...this.config };
  }

  public update(patch: Partial<LocalNASSANStorageArchiverEngineConfig>): LocalNASSANStorageArchiverEngineConfig {
    this.config = { ...this.config, ...patch };
    this.validate();
    return this.get();
  }

  public validate(): boolean {
    if (this.config.syncIntervalSec < 1) {
      throw new Error('[Local NAS & SAN Storage Archiver] syncIntervalSec must be at least 1 second.');
    }
    if (this.config.maxBatchSize < 1 || this.config.maxBatchSize > 50000) {
      throw new Error('[Local NAS & SAN Storage Archiver] maxBatchSize must be between 1 and 50,000.');
    }
    return true;
  }
}

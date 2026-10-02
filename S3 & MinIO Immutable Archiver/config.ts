/**
 * @file config.ts
 * @description Configuration parser, schema validator, and environment resolver for S3 & MinIO Immutable Archiver.
 * @module @cmox/plugin-s3-snapshot-archiver/config
 */

import { S3MinIOImmutableArchiverEngineConfig, PluginLogLevel } from './types';

export class S3MinIOImmutableArchiverConfigManager {
  private config: S3MinIOImmutableArchiverEngineConfig;

  constructor(custom?: Partial<S3MinIOImmutableArchiverEngineConfig>) {
    this.config = this.resolveDefaults(custom);
    this.validate();
  }

  private resolveDefaults(custom?: Partial<S3MinIOImmutableArchiverEngineConfig>): S3MinIOImmutableArchiverEngineConfig {
    const envPrefix = 'CMOX_PLUGIN_S3_SNAPSHOT_ARCHIVER_';

    return {
      enabled: custom?.enabled ?? (process.env[`${envPrefix}ENABLED`] ? process.env[`${envPrefix}ENABLED`] !== 'false' : true),
      autoUpdate: custom?.autoUpdate ?? (process.env[`${envPrefix}AUTO_UPDATE`] ? process.env[`${envPrefix}AUTO_UPDATE`] !== 'false' : true),
      endpoint: custom?.endpoint || process.env[`${envPrefix}ENDPOINT`] || "https://s3.us-east-1.amazonaws.com",
      apiKey: custom?.apiKey || process.env[`${envPrefix}API_KEY`] || "",
      logLevel: (custom?.logLevel || process.env[`${envPrefix}LOG_LEVEL`] || 'info') as PluginLogLevel,
      syncIntervalSec: custom?.syncIntervalSec ?? (Number(process.env[`${envPrefix}SYNC_INTERVAL`]) || 10),
      maxBatchSize: custom?.maxBatchSize ?? (Number(process.env[`${envPrefix}MAX_BATCH_SIZE`]) || 250),
      timeoutMs: custom?.timeoutMs ?? (Number(process.env[`${envPrefix}TIMEOUT_MS`]) || 5000),
      retryAttempts: custom?.retryAttempts ?? 3,
      connectionPoolSize: custom?.connectionPoolSize ?? 8,
      backpressureThreshold: custom?.backpressureThreshold ?? 10000,
      enableEncryption: custom?.enableEncryption ?? true,
      param1: custom?.param1 || process.env[`${envPrefix}PARAM1`] || "company-cmox-backups",
      param2: custom?.param2 || process.env[`${envPrefix}PARAM2`] || "GLACIER_IR",
      customOptions: custom?.customOptions || {}
    };
  }

  public get(): S3MinIOImmutableArchiverEngineConfig {
    return { ...this.config };
  }

  public update(patch: Partial<S3MinIOImmutableArchiverEngineConfig>): S3MinIOImmutableArchiverEngineConfig {
    this.config = { ...this.config, ...patch };
    this.validate();
    return this.get();
  }

  public validate(): boolean {
    if (this.config.syncIntervalSec < 1) {
      throw new Error('[S3 & MinIO Immutable Archiver] syncIntervalSec must be at least 1 second.');
    }
    if (this.config.maxBatchSize < 1 || this.config.maxBatchSize > 50000) {
      throw new Error('[S3 & MinIO Immutable Archiver] maxBatchSize must be between 1 and 50,000.');
    }
    return true;
  }
}

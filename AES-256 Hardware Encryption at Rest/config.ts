/**
 * @file config.ts
 * @description Configuration parser, schema validator, and environment resolver for AES-256 Hardware Encryption at Rest.
 * @module @cmox/plugin-aes256-encryption/config
 */

import { AES256HardwareEncryptionatRestEngineConfig, PluginLogLevel } from './types';

export class AES256HardwareEncryptionatRestConfigManager {
  private config: AES256HardwareEncryptionatRestEngineConfig;

  constructor(custom?: Partial<AES256HardwareEncryptionatRestEngineConfig>) {
    this.config = this.resolveDefaults(custom);
    this.validate();
  }

  private resolveDefaults(custom?: Partial<AES256HardwareEncryptionatRestEngineConfig>): AES256HardwareEncryptionatRestEngineConfig {
    const envPrefix = 'CMOX_PLUGIN_AES256_ENCRYPTION_';

    return {
      enabled: custom?.enabled ?? (process.env[`${envPrefix}ENABLED`] ? process.env[`${envPrefix}ENABLED`] !== 'false' : true),
      autoUpdate: custom?.autoUpdate ?? (process.env[`${envPrefix}AUTO_UPDATE`] ? process.env[`${envPrefix}AUTO_UPDATE`] !== 'false' : true),
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
      bridgePort: custom?.bridgePort ?? (Number(process.env[`${envPrefix}BRIDGE_PORT`]) || 7890),
      param1: custom?.param1 || process.env[`${envPrefix}PARAM1`] || "AES-256-GCM",
      param2: custom?.param2 || process.env[`${envPrefix}PARAM2`] || "100000",
      customOptions: custom?.customOptions || {}
    };
  }

  public get(): AES256HardwareEncryptionatRestEngineConfig {
    return { ...this.config };
  }

  public update(patch: Partial<AES256HardwareEncryptionatRestEngineConfig>): AES256HardwareEncryptionatRestEngineConfig {
    this.config = { ...this.config, ...patch };
    this.validate();
    return this.get();
  }

  public validate(): boolean {
    if (this.config.syncIntervalSec < 1) {
      throw new Error('[AES-256 Hardware Encryption at Rest] syncIntervalSec must be at least 1 second.');
    }
    if (this.config.maxBatchSize < 1 || this.config.maxBatchSize > 50000) {
      throw new Error('[AES-256 Hardware Encryption at Rest] maxBatchSize must be between 1 and 50,000.');
    }
    return true;
  }
}

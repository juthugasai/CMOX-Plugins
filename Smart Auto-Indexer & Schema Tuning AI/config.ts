/**
 * @file config.ts
 * @description Configuration parser, schema validator, and environment resolver for Smart Auto-Indexer & Schema Tuning AI.
 * @module @cmox/plugin-smart-auto-indexer/config
 */

import { SmartAutoIndexerSchemaTuningAIEngineConfig, PluginLogLevel } from './types';

export class SmartAutoIndexerSchemaTuningAIConfigManager {
  private config: SmartAutoIndexerSchemaTuningAIEngineConfig;

  constructor(custom?: Partial<SmartAutoIndexerSchemaTuningAIEngineConfig>) {
    this.config = this.resolveDefaults(custom);
    this.validate();
  }

  private resolveDefaults(custom?: Partial<SmartAutoIndexerSchemaTuningAIEngineConfig>): SmartAutoIndexerSchemaTuningAIEngineConfig {
    const envPrefix = 'CMOX_PLUGIN_SMART_AUTO_INDEXER_';

    return {
      enabled: custom?.enabled ?? (process.env[`${envPrefix}ENABLED`] ? process.env[`${envPrefix}ENABLED`] !== 'false' : true),
      autoUpdate: custom?.autoUpdate ?? (process.env[`${envPrefix}AUTO_UPDATE`] ? process.env[`${envPrefix}AUTO_UPDATE`] !== 'false' : true),
      endpoint: custom?.endpoint || process.env[`${envPrefix}ENDPOINT`] || "http://localhost:9092",
      apiKey: custom?.apiKey || process.env[`${envPrefix}API_KEY`] || "",
      logLevel: (custom?.logLevel || process.env[`${envPrefix}LOG_LEVEL`] || 'info') as PluginLogLevel,
      syncIntervalSec: custom?.syncIntervalSec ?? (Number(process.env[`${envPrefix}SYNC_INTERVAL`]) || 600),
      maxBatchSize: custom?.maxBatchSize ?? (Number(process.env[`${envPrefix}MAX_BATCH_SIZE`]) || 250),
      timeoutMs: custom?.timeoutMs ?? (Number(process.env[`${envPrefix}TIMEOUT_MS`]) || 5000),
      retryAttempts: custom?.retryAttempts ?? 3,
      connectionPoolSize: custom?.connectionPoolSize ?? 8,
      backpressureThreshold: custom?.backpressureThreshold ?? 10000,
      enableEncryption: custom?.enableEncryption ?? true,
      param1: custom?.param1 || process.env[`${envPrefix}PARAM1`] || "false",
      param2: custom?.param2 || process.env[`${envPrefix}PARAM2`] || "100",
      customOptions: custom?.customOptions || {}
    };
  }

  public get(): SmartAutoIndexerSchemaTuningAIEngineConfig {
    return { ...this.config };
  }

  public update(patch: Partial<SmartAutoIndexerSchemaTuningAIEngineConfig>): SmartAutoIndexerSchemaTuningAIEngineConfig {
    this.config = { ...this.config, ...patch };
    this.validate();
    return this.get();
  }

  public validate(): boolean {
    if (this.config.syncIntervalSec < 1) {
      throw new Error('[Smart Auto-Indexer & Schema Tuning AI] syncIntervalSec must be at least 1 second.');
    }
    if (this.config.maxBatchSize < 1 || this.config.maxBatchSize > 50000) {
      throw new Error('[Smart Auto-Indexer & Schema Tuning AI] maxBatchSize must be between 1 and 50,000.');
    }
    return true;
  }
}

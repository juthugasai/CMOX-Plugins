/**
 * @file config.ts
 * @description Configuration parser, schema validator, and environment resolver for Presto / Trino SQL Query Federation Layer.
 * @module @cmox/plugin-trino-query-federation/config
 */

import { PrestoTrinoSQLQueryFederationLayerEngineConfig, PluginLogLevel } from './types';

export class PrestoTrinoSQLQueryFederationLayerConfigManager {
  private config: PrestoTrinoSQLQueryFederationLayerEngineConfig;

  constructor(custom?: Partial<PrestoTrinoSQLQueryFederationLayerEngineConfig>) {
    this.config = this.resolveDefaults(custom);
    this.validate();
  }

  private resolveDefaults(custom?: Partial<PrestoTrinoSQLQueryFederationLayerEngineConfig>): PrestoTrinoSQLQueryFederationLayerEngineConfig {
    const envPrefix = 'CMOX_PLUGIN_TRINO_QUERY_FEDERATION_';

    return {
      enabled: custom?.enabled ?? (process.env[`${envPrefix}ENABLED`] ? process.env[`${envPrefix}ENABLED`] !== 'false' : false),
      autoUpdate: custom?.autoUpdate ?? (process.env[`${envPrefix}AUTO_UPDATE`] ? process.env[`${envPrefix}AUTO_UPDATE`] !== 'false' : true),
      endpoint: custom?.endpoint || process.env[`${envPrefix}ENDPOINT`] || "http://trino-coordinator:8080",
      apiKey: custom?.apiKey || process.env[`${envPrefix}API_KEY`] || "",
      logLevel: (custom?.logLevel || process.env[`${envPrefix}LOG_LEVEL`] || 'info') as PluginLogLevel,
      syncIntervalSec: custom?.syncIntervalSec ?? (Number(process.env[`${envPrefix}SYNC_INTERVAL`]) || 10),
      maxBatchSize: custom?.maxBatchSize ?? (Number(process.env[`${envPrefix}MAX_BATCH_SIZE`]) || 250),
      timeoutMs: custom?.timeoutMs ?? (Number(process.env[`${envPrefix}TIMEOUT_MS`]) || 5000),
      retryAttempts: custom?.retryAttempts ?? 3,
      connectionPoolSize: custom?.connectionPoolSize ?? 8,
      backpressureThreshold: custom?.backpressureThreshold ?? 10000,
      enableEncryption: custom?.enableEncryption ?? true,
      param1: custom?.param1 || process.env[`${envPrefix}PARAM1`] || "cmox_federation",
      param2: custom?.param2 || process.env[`${envPrefix}PARAM2`] || "16GB",
      customOptions: custom?.customOptions || {}
    };
  }

  public get(): PrestoTrinoSQLQueryFederationLayerEngineConfig {
    return { ...this.config };
  }

  public update(patch: Partial<PrestoTrinoSQLQueryFederationLayerEngineConfig>): PrestoTrinoSQLQueryFederationLayerEngineConfig {
    this.config = { ...this.config, ...patch };
    this.validate();
    return this.get();
  }

  public validate(): boolean {
    if (this.config.syncIntervalSec < 1) {
      throw new Error('[Presto / Trino SQL Query Federation Layer] syncIntervalSec must be at least 1 second.');
    }
    if (this.config.maxBatchSize < 1 || this.config.maxBatchSize > 50000) {
      throw new Error('[Presto / Trino SQL Query Federation Layer] maxBatchSize must be between 1 and 50,000.');
    }
    return true;
  }
}

/**
 * @file config.ts
 * @description Configuration parser, schema validator, and environment resolver for Snowflake Cloud Data Warehouse Link.
 * @module @cmox/plugin-snowflake-sync/config
 */

import { SnowflakeCloudDataWarehouseLinkEngineConfig, PluginLogLevel } from './types';

export class SnowflakeCloudDataWarehouseLinkConfigManager {
  private config: SnowflakeCloudDataWarehouseLinkEngineConfig;

  constructor(custom?: Partial<SnowflakeCloudDataWarehouseLinkEngineConfig>) {
    this.config = this.resolveDefaults(custom);
    this.validate();
  }

  private resolveDefaults(custom?: Partial<SnowflakeCloudDataWarehouseLinkEngineConfig>): SnowflakeCloudDataWarehouseLinkEngineConfig {
    const envPrefix = 'CMOX_PLUGIN_SNOWFLAKE_SYNC_';

    return {
      enabled: custom?.enabled ?? (process.env[`${envPrefix}ENABLED`] ? process.env[`${envPrefix}ENABLED`] !== 'false' : false),
      autoUpdate: custom?.autoUpdate ?? (process.env[`${envPrefix}AUTO_UPDATE`] ? process.env[`${envPrefix}AUTO_UPDATE`] !== 'false' : true),
      endpoint: custom?.endpoint || process.env[`${envPrefix}ENDPOINT`] || "https://xyz12345.snowflakecomputing.com",
      apiKey: custom?.apiKey || process.env[`${envPrefix}API_KEY`] || "",
      logLevel: (custom?.logLevel || process.env[`${envPrefix}LOG_LEVEL`] || 'info') as PluginLogLevel,
      syncIntervalSec: custom?.syncIntervalSec ?? (Number(process.env[`${envPrefix}SYNC_INTERVAL`]) || 300),
      maxBatchSize: custom?.maxBatchSize ?? (Number(process.env[`${envPrefix}MAX_BATCH_SIZE`]) || 250),
      timeoutMs: custom?.timeoutMs ?? (Number(process.env[`${envPrefix}TIMEOUT_MS`]) || 5000),
      retryAttempts: custom?.retryAttempts ?? 3,
      connectionPoolSize: custom?.connectionPoolSize ?? 8,
      backpressureThreshold: custom?.backpressureThreshold ?? 10000,
      enableEncryption: custom?.enableEncryption ?? true,
      param1: custom?.param1 || process.env[`${envPrefix}PARAM1`] || "COMPUTE_WH",
      param2: custom?.param2 || process.env[`${envPrefix}PARAM2`] || "CMOX_RAW",
      customOptions: custom?.customOptions || {}
    };
  }

  public get(): SnowflakeCloudDataWarehouseLinkEngineConfig {
    return { ...this.config };
  }

  public update(patch: Partial<SnowflakeCloudDataWarehouseLinkEngineConfig>): SnowflakeCloudDataWarehouseLinkEngineConfig {
    this.config = { ...this.config, ...patch };
    this.validate();
    return this.get();
  }

  public validate(): boolean {
    if (this.config.syncIntervalSec < 1) {
      throw new Error('[Snowflake Cloud Data Warehouse Link] syncIntervalSec must be at least 1 second.');
    }
    if (this.config.maxBatchSize < 1 || this.config.maxBatchSize > 50000) {
      throw new Error('[Snowflake Cloud Data Warehouse Link] maxBatchSize must be between 1 and 50,000.');
    }
    return true;
  }
}

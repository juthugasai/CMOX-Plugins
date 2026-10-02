/**
 * @file config.ts
 * @description Configuration parser, schema validator, and environment resolver for Apache Cassandra Wide-Column Bridge.
 * @module @cmox/plugin-cassandra-bridge/config
 */

import { ApacheCassandraWideColumnBridgeEngineConfig, PluginLogLevel } from './types';

export class ApacheCassandraWideColumnBridgeConfigManager {
  private config: ApacheCassandraWideColumnBridgeEngineConfig;

  constructor(custom?: Partial<ApacheCassandraWideColumnBridgeEngineConfig>) {
    this.config = this.resolveDefaults(custom);
    this.validate();
  }

  private resolveDefaults(custom?: Partial<ApacheCassandraWideColumnBridgeEngineConfig>): ApacheCassandraWideColumnBridgeEngineConfig {
    const envPrefix = 'CMOX_PLUGIN_CASSANDRA_BRIDGE_';

    return {
      enabled: custom?.enabled ?? (process.env[`${envPrefix}ENABLED`] ? process.env[`${envPrefix}ENABLED`] !== 'false' : false),
      autoUpdate: custom?.autoUpdate ?? (process.env[`${envPrefix}AUTO_UPDATE`] ? process.env[`${envPrefix}AUTO_UPDATE`] !== 'false' : true),
      endpoint: custom?.endpoint || process.env[`${envPrefix}ENDPOINT`] || "cassandra://127.0.0.1:9042",
      apiKey: custom?.apiKey || process.env[`${envPrefix}API_KEY`] || "",
      logLevel: (custom?.logLevel || process.env[`${envPrefix}LOG_LEVEL`] || 'info') as PluginLogLevel,
      syncIntervalSec: custom?.syncIntervalSec ?? (Number(process.env[`${envPrefix}SYNC_INTERVAL`]) || 10),
      maxBatchSize: custom?.maxBatchSize ?? (Number(process.env[`${envPrefix}MAX_BATCH_SIZE`]) || 250),
      timeoutMs: custom?.timeoutMs ?? (Number(process.env[`${envPrefix}TIMEOUT_MS`]) || 5000),
      retryAttempts: custom?.retryAttempts ?? 3,
      connectionPoolSize: custom?.connectionPoolSize ?? 8,
      backpressureThreshold: custom?.backpressureThreshold ?? 10000,
      enableEncryption: custom?.enableEncryption ?? true,
      param1: custom?.param1 || process.env[`${envPrefix}PARAM1`] || "cmox_keyspace",
      param2: custom?.param2 || process.env[`${envPrefix}PARAM2`] || "LOCAL_QUORUM",
      customOptions: custom?.customOptions || {}
    };
  }

  public get(): ApacheCassandraWideColumnBridgeEngineConfig {
    return { ...this.config };
  }

  public update(patch: Partial<ApacheCassandraWideColumnBridgeEngineConfig>): ApacheCassandraWideColumnBridgeEngineConfig {
    this.config = { ...this.config, ...patch };
    this.validate();
    return this.get();
  }

  public validate(): boolean {
    if (this.config.syncIntervalSec < 1) {
      throw new Error('[Apache Cassandra Wide-Column Bridge] syncIntervalSec must be at least 1 second.');
    }
    if (this.config.maxBatchSize < 1 || this.config.maxBatchSize > 50000) {
      throw new Error('[Apache Cassandra Wide-Column Bridge] maxBatchSize must be between 1 and 50,000.');
    }
    return true;
  }
}

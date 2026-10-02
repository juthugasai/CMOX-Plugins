/**
 * @file config.ts
 * @description Configuration parser, schema validator, and environment resolver for Schema Drift & Unauthorized DDL Detector.
 * @module @cmox/plugin-schema-drift-detector/config
 */

import { SchemaDriftUnauthorizedDDLDetectorEngineConfig, PluginLogLevel } from './types';

export class SchemaDriftUnauthorizedDDLDetectorConfigManager {
  private config: SchemaDriftUnauthorizedDDLDetectorEngineConfig;

  constructor(custom?: Partial<SchemaDriftUnauthorizedDDLDetectorEngineConfig>) {
    this.config = this.resolveDefaults(custom);
    this.validate();
  }

  private resolveDefaults(custom?: Partial<SchemaDriftUnauthorizedDDLDetectorEngineConfig>): SchemaDriftUnauthorizedDDLDetectorEngineConfig {
    const envPrefix = 'CMOX_PLUGIN_SCHEMA_DRIFT_DETECTOR_';

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
      param1: custom?.param1 || process.env[`${envPrefix}PARAM1`] || "github_actions_bot,deploy_agent",
      param2: custom?.param2 || process.env[`${envPrefix}PARAM2`] || "false",
      customOptions: custom?.customOptions || {}
    };
  }

  public get(): SchemaDriftUnauthorizedDDLDetectorEngineConfig {
    return { ...this.config };
  }

  public update(patch: Partial<SchemaDriftUnauthorizedDDLDetectorEngineConfig>): SchemaDriftUnauthorizedDDLDetectorEngineConfig {
    this.config = { ...this.config, ...patch };
    this.validate();
    return this.get();
  }

  public validate(): boolean {
    if (this.config.syncIntervalSec < 1) {
      throw new Error('[Schema Drift & Unauthorized DDL Detector] syncIntervalSec must be at least 1 second.');
    }
    if (this.config.maxBatchSize < 1 || this.config.maxBatchSize > 50000) {
      throw new Error('[Schema Drift & Unauthorized DDL Detector] maxBatchSize must be between 1 and 50,000.');
    }
    return true;
  }
}

/**
 * @file config.ts
 * @description Configuration parser, schema validator, and environment resolver for Database Schema Version Control & Git Diff.
 * @module @cmox/plugin-schema-git-versioning/config
 */

import { DatabaseSchemaVersionControlGitDiffEngineConfig, PluginLogLevel } from './types';

export class DatabaseSchemaVersionControlGitDiffConfigManager {
  private config: DatabaseSchemaVersionControlGitDiffEngineConfig;

  constructor(custom?: Partial<DatabaseSchemaVersionControlGitDiffEngineConfig>) {
    this.config = this.resolveDefaults(custom);
    this.validate();
  }

  private resolveDefaults(custom?: Partial<DatabaseSchemaVersionControlGitDiffEngineConfig>): DatabaseSchemaVersionControlGitDiffEngineConfig {
    const envPrefix = 'CMOX_PLUGIN_SCHEMA_GIT_VERSIONING_';

    return {
      enabled: custom?.enabled ?? (process.env[`${envPrefix}ENABLED`] ? process.env[`${envPrefix}ENABLED`] !== 'false' : true),
      autoUpdate: custom?.autoUpdate ?? (process.env[`${envPrefix}AUTO_UPDATE`] ? process.env[`${envPrefix}AUTO_UPDATE`] !== 'false' : true),
      endpoint: custom?.endpoint || process.env[`${envPrefix}ENDPOINT`] || "http://localhost:9092",
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
      webhookUrl: custom?.webhookUrl || process.env[`${envPrefix}WEBHOOK_URL`] || 'https://api.cmox.io/v1/plugins/schema-git-versioning/webhook',
      webhookSecret: custom?.webhookSecret || process.env[`${envPrefix}WEBHOOK_SECRET`] || 'cmox_sec_live_default_key',
      param1: custom?.param1 || process.env[`${envPrefix}PARAM1`] || "./migrations",
      param2: custom?.param2 || process.env[`${envPrefix}PARAM2`] || "true",
      customOptions: custom?.customOptions || {}
    };
  }

  public get(): DatabaseSchemaVersionControlGitDiffEngineConfig {
    return { ...this.config };
  }

  public update(patch: Partial<DatabaseSchemaVersionControlGitDiffEngineConfig>): DatabaseSchemaVersionControlGitDiffEngineConfig {
    this.config = { ...this.config, ...patch };
    this.validate();
    return this.get();
  }

  public validate(): boolean {
    if (this.config.syncIntervalSec < 1) {
      throw new Error('[Database Schema Version Control & Git Diff] syncIntervalSec must be at least 1 second.');
    }
    if (this.config.maxBatchSize < 1 || this.config.maxBatchSize > 50000) {
      throw new Error('[Database Schema Version Control & Git Diff] maxBatchSize must be between 1 and 50,000.');
    }
    return true;
  }
}

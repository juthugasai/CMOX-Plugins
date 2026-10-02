/**
 * @file config.ts
 * @description Configuration parser, schema validator, and environment resolver for Notion Database 2-Way Sync Bridge.
 * @module @cmox/plugin-notion-bridge/config
 */

import { NotionDatabase2WaySyncBridgeEngineConfig, PluginLogLevel } from './types';

export class NotionDatabase2WaySyncBridgeConfigManager {
  private config: NotionDatabase2WaySyncBridgeEngineConfig;

  constructor(custom?: Partial<NotionDatabase2WaySyncBridgeEngineConfig>) {
    this.config = this.resolveDefaults(custom);
    this.validate();
  }

  private resolveDefaults(custom?: Partial<NotionDatabase2WaySyncBridgeEngineConfig>): NotionDatabase2WaySyncBridgeEngineConfig {
    const envPrefix = 'CMOX_PLUGIN_NOTION_BRIDGE_';

    return {
      enabled: custom?.enabled ?? (process.env[`${envPrefix}ENABLED`] ? process.env[`${envPrefix}ENABLED`] !== 'false' : false),
      autoUpdate: custom?.autoUpdate ?? (process.env[`${envPrefix}AUTO_UPDATE`] ? process.env[`${envPrefix}AUTO_UPDATE`] !== 'false' : true),
      endpoint: custom?.endpoint || process.env[`${envPrefix}ENDPOINT`] || "http://localhost:9092",
      apiKey: custom?.apiKey || process.env[`${envPrefix}API_KEY`] || "secret_notion_api_token",
      logLevel: (custom?.logLevel || process.env[`${envPrefix}LOG_LEVEL`] || 'warn') as PluginLogLevel,
      syncIntervalSec: custom?.syncIntervalSec ?? (Number(process.env[`${envPrefix}SYNC_INTERVAL`]) || 60),
      maxBatchSize: custom?.maxBatchSize ?? (Number(process.env[`${envPrefix}MAX_BATCH_SIZE`]) || 250),
      timeoutMs: custom?.timeoutMs ?? (Number(process.env[`${envPrefix}TIMEOUT_MS`]) || 5000),
      retryAttempts: custom?.retryAttempts ?? 3,
      connectionPoolSize: custom?.connectionPoolSize ?? 8,
      backpressureThreshold: custom?.backpressureThreshold ?? 10000,
      enableEncryption: custom?.enableEncryption ?? true,
      bridgePort: custom?.bridgePort ?? (Number(process.env[`${envPrefix}BRIDGE_PORT`]) || 7890),
      webhookUrl: custom?.webhookUrl || process.env[`${envPrefix}WEBHOOK_URL`] || 'https://api.cmox.io/v1/plugins/notion-bridge/webhook',
      webhookSecret: custom?.webhookSecret || process.env[`${envPrefix}WEBHOOK_SECRET`] || 'cmox_sec_live_default_key',
      param1: custom?.param1 || process.env[`${envPrefix}PARAM1`] || "8f7e2d9a1b4c...",
      param2: custom?.param2 || process.env[`${envPrefix}PARAM2`] || "cmox-wins",
      customOptions: custom?.customOptions || {}
    };
  }

  public get(): NotionDatabase2WaySyncBridgeEngineConfig {
    return { ...this.config };
  }

  public update(patch: Partial<NotionDatabase2WaySyncBridgeEngineConfig>): NotionDatabase2WaySyncBridgeEngineConfig {
    this.config = { ...this.config, ...patch };
    this.validate();
    return this.get();
  }

  public validate(): boolean {
    if (this.config.syncIntervalSec < 1) {
      throw new Error('[Notion Database 2-Way Sync Bridge] syncIntervalSec must be at least 1 second.');
    }
    if (this.config.maxBatchSize < 1 || this.config.maxBatchSize > 50000) {
      throw new Error('[Notion Database 2-Way Sync Bridge] maxBatchSize must be between 1 and 50,000.');
    }
    return true;
  }
}

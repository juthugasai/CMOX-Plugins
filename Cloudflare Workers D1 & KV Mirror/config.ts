/**
 * @file config.ts
 * @description Configuration parser, schema validator, and environment resolver for Cloudflare Workers D1 & KV Mirror.
 * @module @cmox/plugin-cloudflare-workers-d1/config
 */

import { CloudflareWorkersD1KVMirrorEngineConfig, PluginLogLevel } from './types';

export class CloudflareWorkersD1KVMirrorConfigManager {
  private config: CloudflareWorkersD1KVMirrorEngineConfig;

  constructor(custom?: Partial<CloudflareWorkersD1KVMirrorEngineConfig>) {
    this.config = this.resolveDefaults(custom);
    this.validate();
  }

  private resolveDefaults(custom?: Partial<CloudflareWorkersD1KVMirrorEngineConfig>): CloudflareWorkersD1KVMirrorEngineConfig {
    const envPrefix = 'CMOX_PLUGIN_CLOUDFLARE_WORKERS_D1_';

    return {
      enabled: custom?.enabled ?? (process.env[`${envPrefix}ENABLED`] ? process.env[`${envPrefix}ENABLED`] !== 'false' : false),
      autoUpdate: custom?.autoUpdate ?? (process.env[`${envPrefix}AUTO_UPDATE`] ? process.env[`${envPrefix}AUTO_UPDATE`] !== 'false' : true),
      endpoint: custom?.endpoint || process.env[`${envPrefix}ENDPOINT`] || "http://localhost:9092",
      apiKey: custom?.apiKey || process.env[`${envPrefix}API_KEY`] || "cf_api_token_here",
      logLevel: (custom?.logLevel || process.env[`${envPrefix}LOG_LEVEL`] || 'info') as PluginLogLevel,
      syncIntervalSec: custom?.syncIntervalSec ?? (Number(process.env[`${envPrefix}SYNC_INTERVAL`]) || 10),
      maxBatchSize: custom?.maxBatchSize ?? (Number(process.env[`${envPrefix}MAX_BATCH_SIZE`]) || 250),
      timeoutMs: custom?.timeoutMs ?? (Number(process.env[`${envPrefix}TIMEOUT_MS`]) || 5000),
      retryAttempts: custom?.retryAttempts ?? 3,
      connectionPoolSize: custom?.connectionPoolSize ?? 8,
      backpressureThreshold: custom?.backpressureThreshold ?? 10000,
      enableEncryption: custom?.enableEncryption ?? true,
      bridgePort: custom?.bridgePort ?? (Number(process.env[`${envPrefix}BRIDGE_PORT`]) || 7890),
      webhookUrl: custom?.webhookUrl || process.env[`${envPrefix}WEBHOOK_URL`] || 'https://api.cmox.io/v1/plugins/cloudflare-workers-d1/webhook',
      webhookSecret: custom?.webhookSecret || process.env[`${envPrefix}WEBHOOK_SECRET`] || 'cmox_sec_live_default_key',
      param1: custom?.param1 || process.env[`${envPrefix}PARAM1`] || "cf_account_12345",
      param2: custom?.param2 || process.env[`${envPrefix}PARAM2`] || "d1-database-uuid",
      customOptions: custom?.customOptions || {}
    };
  }

  public get(): CloudflareWorkersD1KVMirrorEngineConfig {
    return { ...this.config };
  }

  public update(patch: Partial<CloudflareWorkersD1KVMirrorEngineConfig>): CloudflareWorkersD1KVMirrorEngineConfig {
    this.config = { ...this.config, ...patch };
    this.validate();
    return this.get();
  }

  public validate(): boolean {
    if (this.config.syncIntervalSec < 1) {
      throw new Error('[Cloudflare Workers D1 & KV Mirror] syncIntervalSec must be at least 1 second.');
    }
    if (this.config.maxBatchSize < 1 || this.config.maxBatchSize > 50000) {
      throw new Error('[Cloudflare Workers D1 & KV Mirror] maxBatchSize must be between 1 and 50,000.');
    }
    return true;
  }
}

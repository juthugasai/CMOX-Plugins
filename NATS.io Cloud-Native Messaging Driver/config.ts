/**
 * @file config.ts
 * @description Configuration parser, schema validator, and environment resolver for NATS.io Cloud-Native Messaging Driver.
 * @module @cmox/plugin-nats-messaging/config
 */

import { NATSioCloudNativeMessagingDriverEngineConfig, PluginLogLevel } from './types';

export class NATSioCloudNativeMessagingDriverConfigManager {
  private config: NATSioCloudNativeMessagingDriverEngineConfig;

  constructor(custom?: Partial<NATSioCloudNativeMessagingDriverEngineConfig>) {
    this.config = this.resolveDefaults(custom);
    this.validate();
  }

  private resolveDefaults(custom?: Partial<NATSioCloudNativeMessagingDriverEngineConfig>): NATSioCloudNativeMessagingDriverEngineConfig {
    const envPrefix = 'CMOX_PLUGIN_NATS_MESSAGING_';

    return {
      enabled: custom?.enabled ?? (process.env[`${envPrefix}ENABLED`] ? process.env[`${envPrefix}ENABLED`] !== 'false' : false),
      autoUpdate: custom?.autoUpdate ?? (process.env[`${envPrefix}AUTO_UPDATE`] ? process.env[`${envPrefix}AUTO_UPDATE`] !== 'false' : true),
      endpoint: custom?.endpoint || process.env[`${envPrefix}ENDPOINT`] || "nats://127.0.0.1:4222",
      apiKey: custom?.apiKey || process.env[`${envPrefix}API_KEY`] || "",
      logLevel: (custom?.logLevel || process.env[`${envPrefix}LOG_LEVEL`] || 'info') as PluginLogLevel,
      syncIntervalSec: custom?.syncIntervalSec ?? (Number(process.env[`${envPrefix}SYNC_INTERVAL`]) || 10),
      maxBatchSize: custom?.maxBatchSize ?? (Number(process.env[`${envPrefix}MAX_BATCH_SIZE`]) || 250),
      timeoutMs: custom?.timeoutMs ?? (Number(process.env[`${envPrefix}TIMEOUT_MS`]) || 5000),
      retryAttempts: custom?.retryAttempts ?? 3,
      connectionPoolSize: custom?.connectionPoolSize ?? 8,
      backpressureThreshold: custom?.backpressureThreshold ?? 10000,
      enableEncryption: custom?.enableEncryption ?? true,
      param1: custom?.param1 || process.env[`${envPrefix}PARAM1`] || "CMOX_STREAM",
      param2: custom?.param2 || process.env[`${envPrefix}PARAM2`] || "database.*",
      customOptions: custom?.customOptions || {}
    };
  }

  public get(): NATSioCloudNativeMessagingDriverEngineConfig {
    return { ...this.config };
  }

  public update(patch: Partial<NATSioCloudNativeMessagingDriverEngineConfig>): NATSioCloudNativeMessagingDriverEngineConfig {
    this.config = { ...this.config, ...patch };
    this.validate();
    return this.get();
  }

  public validate(): boolean {
    if (this.config.syncIntervalSec < 1) {
      throw new Error('[NATS.io Cloud-Native Messaging Driver] syncIntervalSec must be at least 1 second.');
    }
    if (this.config.maxBatchSize < 1 || this.config.maxBatchSize > 50000) {
      throw new Error('[NATS.io Cloud-Native Messaging Driver] maxBatchSize must be between 1 and 50,000.');
    }
    return true;
  }
}

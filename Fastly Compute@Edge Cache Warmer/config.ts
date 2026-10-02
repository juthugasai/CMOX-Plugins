/**
 * @file config.ts
 * @description Configuration parser, schema validator, and environment resolver for Fastly Compute@Edge Cache Warmer.
 * @module @cmox/plugin-fastly-compute-warmer/config
 */

import { FastlyComputeEdgeCacheWarmerEngineConfig, PluginLogLevel } from './types';

export class FastlyComputeEdgeCacheWarmerConfigManager {
  private config: FastlyComputeEdgeCacheWarmerEngineConfig;

  constructor(custom?: Partial<FastlyComputeEdgeCacheWarmerEngineConfig>) {
    this.config = this.resolveDefaults(custom);
    this.validate();
  }

  private resolveDefaults(custom?: Partial<FastlyComputeEdgeCacheWarmerEngineConfig>): FastlyComputeEdgeCacheWarmerEngineConfig {
    const envPrefix = 'CMOX_PLUGIN_FASTLY_COMPUTE_WARMER_';

    return {
      enabled: custom?.enabled ?? (process.env[`${envPrefix}ENABLED`] ? process.env[`${envPrefix}ENABLED`] !== 'false' : false),
      autoUpdate: custom?.autoUpdate ?? (process.env[`${envPrefix}AUTO_UPDATE`] ? process.env[`${envPrefix}AUTO_UPDATE`] !== 'false' : true),
      endpoint: custom?.endpoint || process.env[`${envPrefix}ENDPOINT`] || "http://localhost:9092",
      apiKey: custom?.apiKey || process.env[`${envPrefix}API_KEY`] || "fastly_api_key_here",
      logLevel: (custom?.logLevel || process.env[`${envPrefix}LOG_LEVEL`] || 'info') as PluginLogLevel,
      syncIntervalSec: custom?.syncIntervalSec ?? (Number(process.env[`${envPrefix}SYNC_INTERVAL`]) || 10),
      maxBatchSize: custom?.maxBatchSize ?? (Number(process.env[`${envPrefix}MAX_BATCH_SIZE`]) || 250),
      timeoutMs: custom?.timeoutMs ?? (Number(process.env[`${envPrefix}TIMEOUT_MS`]) || 5000),
      retryAttempts: custom?.retryAttempts ?? 3,
      connectionPoolSize: custom?.connectionPoolSize ?? 8,
      backpressureThreshold: custom?.backpressureThreshold ?? 10000,
      enableEncryption: custom?.enableEncryption ?? true,
      param1: custom?.param1 || process.env[`${envPrefix}PARAM1`] || "fastly_service_123",
      param2: custom?.param2 || process.env[`${envPrefix}PARAM2`] || "Surrogate-Key",
      customOptions: custom?.customOptions || {}
    };
  }

  public get(): FastlyComputeEdgeCacheWarmerEngineConfig {
    return { ...this.config };
  }

  public update(patch: Partial<FastlyComputeEdgeCacheWarmerEngineConfig>): FastlyComputeEdgeCacheWarmerEngineConfig {
    this.config = { ...this.config, ...patch };
    this.validate();
    return this.get();
  }

  public validate(): boolean {
    if (this.config.syncIntervalSec < 1) {
      throw new Error('[Fastly Compute@Edge Cache Warmer] syncIntervalSec must be at least 1 second.');
    }
    if (this.config.maxBatchSize < 1 || this.config.maxBatchSize > 50000) {
      throw new Error('[Fastly Compute@Edge Cache Warmer] maxBatchSize must be between 1 and 50,000.');
    }
    return true;
  }
}

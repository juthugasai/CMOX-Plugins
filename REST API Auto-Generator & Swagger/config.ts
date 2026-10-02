/**
 * @file config.ts
 * @description Configuration parser, schema validator, and environment resolver for REST API Auto-Generator & Swagger.
 * @module @cmox/plugin-rest-generator/config
 */

import { RESTAPIAutoGeneratorSwaggerEngineConfig, PluginLogLevel } from './types';

export class RESTAPIAutoGeneratorSwaggerConfigManager {
  private config: RESTAPIAutoGeneratorSwaggerEngineConfig;

  constructor(custom?: Partial<RESTAPIAutoGeneratorSwaggerEngineConfig>) {
    this.config = this.resolveDefaults(custom);
    this.validate();
  }

  private resolveDefaults(custom?: Partial<RESTAPIAutoGeneratorSwaggerEngineConfig>): RESTAPIAutoGeneratorSwaggerEngineConfig {
    const envPrefix = 'CMOX_PLUGIN_REST_GENERATOR_';

    return {
      enabled: custom?.enabled ?? (process.env[`${envPrefix}ENABLED`] ? process.env[`${envPrefix}ENABLED`] !== 'false' : true),
      autoUpdate: custom?.autoUpdate ?? (process.env[`${envPrefix}AUTO_UPDATE`] ? process.env[`${envPrefix}AUTO_UPDATE`] !== 'false' : true),
      endpoint: custom?.endpoint || process.env[`${envPrefix}ENDPOINT`] || "/api/v1",
      apiKey: custom?.apiKey || process.env[`${envPrefix}API_KEY`] || "",
      logLevel: (custom?.logLevel || process.env[`${envPrefix}LOG_LEVEL`] || 'info') as PluginLogLevel,
      syncIntervalSec: custom?.syncIntervalSec ?? (Number(process.env[`${envPrefix}SYNC_INTERVAL`]) || 10),
      maxBatchSize: custom?.maxBatchSize ?? (Number(process.env[`${envPrefix}MAX_BATCH_SIZE`]) || 250),
      timeoutMs: custom?.timeoutMs ?? (Number(process.env[`${envPrefix}TIMEOUT_MS`]) || 5000),
      retryAttempts: custom?.retryAttempts ?? 3,
      connectionPoolSize: custom?.connectionPoolSize ?? 8,
      backpressureThreshold: custom?.backpressureThreshold ?? 10000,
      enableEncryption: custom?.enableEncryption ?? true,
      param1: custom?.param1 || process.env[`${envPrefix}PARAM1`] || "50",
      param2: custom?.param2 || process.env[`${envPrefix}PARAM2`] || "250",
      customOptions: custom?.customOptions || {}
    };
  }

  public get(): RESTAPIAutoGeneratorSwaggerEngineConfig {
    return { ...this.config };
  }

  public update(patch: Partial<RESTAPIAutoGeneratorSwaggerEngineConfig>): RESTAPIAutoGeneratorSwaggerEngineConfig {
    this.config = { ...this.config, ...patch };
    this.validate();
    return this.get();
  }

  public validate(): boolean {
    if (this.config.syncIntervalSec < 1) {
      throw new Error('[REST API Auto-Generator & Swagger] syncIntervalSec must be at least 1 second.');
    }
    if (this.config.maxBatchSize < 1 || this.config.maxBatchSize > 50000) {
      throw new Error('[REST API Auto-Generator & Swagger] maxBatchSize must be between 1 and 50,000.');
    }
    return true;
  }
}

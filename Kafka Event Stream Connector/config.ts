/**
 * @file config.ts
 * @description Configuration parser, schema validator, and environment resolver for Kafka Event Stream Connector.
 * @module @cmox/plugin-kafka-connector/config
 */

import { KafkaEventStreamConnectorEngineConfig, PluginLogLevel } from './types';

export class KafkaEventStreamConnectorConfigManager {
  private config: KafkaEventStreamConnectorEngineConfig;

  constructor(custom?: Partial<KafkaEventStreamConnectorEngineConfig>) {
    this.config = this.resolveDefaults(custom);
    this.validate();
  }

  private resolveDefaults(custom?: Partial<KafkaEventStreamConnectorEngineConfig>): KafkaEventStreamConnectorEngineConfig {
    const envPrefix = 'CMOX_PLUGIN_KAFKA_CONNECTOR_';

    return {
      enabled: custom?.enabled ?? (process.env[`${envPrefix}ENABLED`] ? process.env[`${envPrefix}ENABLED`] !== 'false' : true),
      autoUpdate: custom?.autoUpdate ?? (process.env[`${envPrefix}AUTO_UPDATE`] ? process.env[`${envPrefix}AUTO_UPDATE`] !== 'false' : true),
      endpoint: custom?.endpoint || process.env[`${envPrefix}ENDPOINT`] || "kafka://127.0.0.1:9092",
      apiKey: custom?.apiKey || process.env[`${envPrefix}API_KEY`] || "",
      logLevel: (custom?.logLevel || process.env[`${envPrefix}LOG_LEVEL`] || 'info') as PluginLogLevel,
      syncIntervalSec: custom?.syncIntervalSec ?? (Number(process.env[`${envPrefix}SYNC_INTERVAL`]) || 1),
      maxBatchSize: custom?.maxBatchSize ?? (Number(process.env[`${envPrefix}MAX_BATCH_SIZE`]) || 250),
      timeoutMs: custom?.timeoutMs ?? (Number(process.env[`${envPrefix}TIMEOUT_MS`]) || 5000),
      retryAttempts: custom?.retryAttempts ?? 3,
      connectionPoolSize: custom?.connectionPoolSize ?? 8,
      backpressureThreshold: custom?.backpressureThreshold ?? 10000,
      enableEncryption: custom?.enableEncryption ?? true,
      param1: custom?.param1 || process.env[`${envPrefix}PARAM1`] || "cmox.events.",
      param2: custom?.param2 || process.env[`${envPrefix}PARAM2`] || "snappy",
      customOptions: custom?.customOptions || {}
    };
  }

  public get(): KafkaEventStreamConnectorEngineConfig {
    return { ...this.config };
  }

  public update(patch: Partial<KafkaEventStreamConnectorEngineConfig>): KafkaEventStreamConnectorEngineConfig {
    this.config = { ...this.config, ...patch };
    this.validate();
    return this.get();
  }

  public validate(): boolean {
    if (this.config.syncIntervalSec < 1) {
      throw new Error('[Kafka Event Stream Connector] syncIntervalSec must be at least 1 second.');
    }
    if (this.config.maxBatchSize < 1 || this.config.maxBatchSize > 50000) {
      throw new Error('[Kafka Event Stream Connector] maxBatchSize must be between 1 and 50,000.');
    }
    return true;
  }
}

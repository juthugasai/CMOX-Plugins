/**
 * @file config.ts
 * @description Configuration parser, schema validator, and environment resolver for PagerDuty & OpsGenie Incident Dispatcher.
 * @module @cmox/plugin-pagerduty-dispatcher/config
 */

import { PagerDutyOpsGenieIncidentDispatcherEngineConfig, PluginLogLevel } from './types';

export class PagerDutyOpsGenieIncidentDispatcherConfigManager {
  private config: PagerDutyOpsGenieIncidentDispatcherEngineConfig;

  constructor(custom?: Partial<PagerDutyOpsGenieIncidentDispatcherEngineConfig>) {
    this.config = this.resolveDefaults(custom);
    this.validate();
  }

  private resolveDefaults(custom?: Partial<PagerDutyOpsGenieIncidentDispatcherEngineConfig>): PagerDutyOpsGenieIncidentDispatcherEngineConfig {
    const envPrefix = 'CMOX_PLUGIN_PAGERDUTY_DISPATCHER_';

    return {
      enabled: custom?.enabled ?? (process.env[`${envPrefix}ENABLED`] ? process.env[`${envPrefix}ENABLED`] !== 'false' : false),
      autoUpdate: custom?.autoUpdate ?? (process.env[`${envPrefix}AUTO_UPDATE`] ? process.env[`${envPrefix}AUTO_UPDATE`] !== 'false' : true),
      endpoint: custom?.endpoint || process.env[`${envPrefix}ENDPOINT`] || "http://localhost:9092",
      apiKey: custom?.apiKey || process.env[`${envPrefix}API_KEY`] || "pd_integration_routing_key",
      logLevel: (custom?.logLevel || process.env[`${envPrefix}LOG_LEVEL`] || 'warn') as PluginLogLevel,
      syncIntervalSec: custom?.syncIntervalSec ?? (Number(process.env[`${envPrefix}SYNC_INTERVAL`]) || 10),
      maxBatchSize: custom?.maxBatchSize ?? (Number(process.env[`${envPrefix}MAX_BATCH_SIZE`]) || 250),
      timeoutMs: custom?.timeoutMs ?? (Number(process.env[`${envPrefix}TIMEOUT_MS`]) || 5000),
      retryAttempts: custom?.retryAttempts ?? 3,
      connectionPoolSize: custom?.connectionPoolSize ?? 8,
      backpressureThreshold: custom?.backpressureThreshold ?? 10000,
      enableEncryption: custom?.enableEncryption ?? true,
      bridgePort: custom?.bridgePort ?? (Number(process.env[`${envPrefix}BRIDGE_PORT`]) || 7890),
      webhookUrl: custom?.webhookUrl || process.env[`${envPrefix}WEBHOOK_URL`] || 'https://api.cmox.io/v1/plugins/pagerduty-dispatcher/webhook',
      webhookSecret: custom?.webhookSecret || process.env[`${envPrefix}WEBHOOK_SECRET`] || 'cmox_sec_live_default_key',
      param1: custom?.param1 || process.env[`${envPrefix}PARAM1`] || "high",
      param2: custom?.param2 || process.env[`${envPrefix}PARAM2`] || "true",
      customOptions: custom?.customOptions || {}
    };
  }

  public get(): PagerDutyOpsGenieIncidentDispatcherEngineConfig {
    return { ...this.config };
  }

  public update(patch: Partial<PagerDutyOpsGenieIncidentDispatcherEngineConfig>): PagerDutyOpsGenieIncidentDispatcherEngineConfig {
    this.config = { ...this.config, ...patch };
    this.validate();
    return this.get();
  }

  public validate(): boolean {
    if (this.config.syncIntervalSec < 1) {
      throw new Error('[PagerDuty & OpsGenie Incident Dispatcher] syncIntervalSec must be at least 1 second.');
    }
    if (this.config.maxBatchSize < 1 || this.config.maxBatchSize > 50000) {
      throw new Error('[PagerDuty & OpsGenie Incident Dispatcher] maxBatchSize must be between 1 and 50,000.');
    }
    return true;
  }
}

/**
 * @file config.ts
 * @description Configuration parser, schema validator, and environment resolver for Regulatory Compliance Report Generator (SOC2/ISO27001).
 * @module @cmox/plugin-regulatory-report-generator/config
 */

import { RegulatoryComplianceReportGeneratorSOC2ISO27001EngineConfig, PluginLogLevel } from './types';

export class RegulatoryComplianceReportGeneratorSOC2ISO27001ConfigManager {
  private config: RegulatoryComplianceReportGeneratorSOC2ISO27001EngineConfig;

  constructor(custom?: Partial<RegulatoryComplianceReportGeneratorSOC2ISO27001EngineConfig>) {
    this.config = this.resolveDefaults(custom);
    this.validate();
  }

  private resolveDefaults(custom?: Partial<RegulatoryComplianceReportGeneratorSOC2ISO27001EngineConfig>): RegulatoryComplianceReportGeneratorSOC2ISO27001EngineConfig {
    const envPrefix = 'CMOX_PLUGIN_REGULATORY_REPORT_GENERATOR_';

    return {
      enabled: custom?.enabled ?? (process.env[`${envPrefix}ENABLED`] ? process.env[`${envPrefix}ENABLED`] !== 'false' : false),
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
      webhookUrl: custom?.webhookUrl || process.env[`${envPrefix}WEBHOOK_URL`] || 'https://api.cmox.io/v1/plugins/regulatory-report-generator/webhook',
      webhookSecret: custom?.webhookSecret || process.env[`${envPrefix}WEBHOOK_SECRET`] || 'cmox_sec_live_default_key',
      param1: custom?.param1 || process.env[`${envPrefix}PARAM1`] || "SOC 2 Type II & ISO 27001",
      param2: custom?.param2 || process.env[`${envPrefix}PARAM2`] || "90",
      customOptions: custom?.customOptions || {}
    };
  }

  public get(): RegulatoryComplianceReportGeneratorSOC2ISO27001EngineConfig {
    return { ...this.config };
  }

  public update(patch: Partial<RegulatoryComplianceReportGeneratorSOC2ISO27001EngineConfig>): RegulatoryComplianceReportGeneratorSOC2ISO27001EngineConfig {
    this.config = { ...this.config, ...patch };
    this.validate();
    return this.get();
  }

  public validate(): boolean {
    if (this.config.syncIntervalSec < 1) {
      throw new Error('[Regulatory Compliance Report Generator (SOC2/ISO27001)] syncIntervalSec must be at least 1 second.');
    }
    if (this.config.maxBatchSize < 1 || this.config.maxBatchSize > 50000) {
      throw new Error('[Regulatory Compliance Report Generator (SOC2/ISO27001)] maxBatchSize must be between 1 and 50,000.');
    }
    return true;
  }
}

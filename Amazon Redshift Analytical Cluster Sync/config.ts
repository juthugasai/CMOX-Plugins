/**
 * @file config.ts
 * @description Configuration parser, schema validator, and environment resolver for Amazon Redshift Analytical Cluster Sync.
 * @module @cmox/plugin-redshift-cluster-sync/config
 */

import { AmazonRedshiftAnalyticalClusterSyncEngineConfig, PluginLogLevel } from './types';

export class AmazonRedshiftAnalyticalClusterSyncConfigManager {
  private config: AmazonRedshiftAnalyticalClusterSyncEngineConfig;

  constructor(custom?: Partial<AmazonRedshiftAnalyticalClusterSyncEngineConfig>) {
    this.config = this.resolveDefaults(custom);
    this.validate();
  }

  private resolveDefaults(custom?: Partial<AmazonRedshiftAnalyticalClusterSyncEngineConfig>): AmazonRedshiftAnalyticalClusterSyncEngineConfig {
    const envPrefix = 'CMOX_PLUGIN_REDSHIFT_CLUSTER_SYNC_';

    return {
      enabled: custom?.enabled ?? (process.env[`${envPrefix}ENABLED`] ? process.env[`${envPrefix}ENABLED`] !== 'false' : false),
      autoUpdate: custom?.autoUpdate ?? (process.env[`${envPrefix}AUTO_UPDATE`] ? process.env[`${envPrefix}AUTO_UPDATE`] !== 'false' : true),
      endpoint: custom?.endpoint || process.env[`${envPrefix}ENDPOINT`] || "redshift-cluster.xyz.us-east-1.redshift.amazonaws.com:5439",
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
      param1: custom?.param1 || process.env[`${envPrefix}PARAM1`] || "arn:aws:iam::123456789:role/RedshiftCopy",
      param2: custom?.param2 || process.env[`${envPrefix}PARAM2`] || "public",
      customOptions: custom?.customOptions || {}
    };
  }

  public get(): AmazonRedshiftAnalyticalClusterSyncEngineConfig {
    return { ...this.config };
  }

  public update(patch: Partial<AmazonRedshiftAnalyticalClusterSyncEngineConfig>): AmazonRedshiftAnalyticalClusterSyncEngineConfig {
    this.config = { ...this.config, ...patch };
    this.validate();
    return this.get();
  }

  public validate(): boolean {
    if (this.config.syncIntervalSec < 1) {
      throw new Error('[Amazon Redshift Analytical Cluster Sync] syncIntervalSec must be at least 1 second.');
    }
    if (this.config.maxBatchSize < 1 || this.config.maxBatchSize > 50000) {
      throw new Error('[Amazon Redshift Analytical Cluster Sync] maxBatchSize must be between 1 and 50,000.');
    }
    return true;
  }
}

/**
 * @file engine.ts
 * @description Core asynchronous orchestrator engine for Elasticsearch Full-Text Search Sync.
 * @module @cmox/plugin-elasticsearch-sync/engine
 */

import { EventEmitter } from 'events';
import {
  ElasticsearchFullTextSearchSyncEngineConfig,
  StreamPayload,
  HealthReport,
  PluginStatus,
  MutationAction
} from './types';
import { ElasticsearchFullTextSearchSyncConfigManager } from './config';
import { ElasticsearchFullTextSearchSyncClient } from './client';
import { ElasticsearchFullTextSearchSyncPipeline } from './pipeline';
import { ElasticsearchFullTextSearchSyncTelemetry } from './telemetry';
import { ElasticsearchFullTextSearchSyncThirdPartyAdapter } from './adapter';
import { ElasticsearchFullTextSearchSyncUniversalBridge } from './bridge';
import { ElasticsearchFullTextSearchSyncWebhookDispatcher } from './webhook';
import { ElasticsearchFullTextSearchSyncIntegrations } from './integrations';

export class ElasticsearchFullTextSearchSyncEngine extends EventEmitter {
  public readonly id = 'elasticsearch-sync';
  public readonly title = "Elasticsearch Full-Text Search Sync";
  public readonly version = 'v2.3.0';
  public readonly category = 'Connectors';

  private configManager: ElasticsearchFullTextSearchSyncConfigManager;
  private client: ElasticsearchFullTextSearchSyncClient;
  private pipeline: ElasticsearchFullTextSearchSyncPipeline;
  private telemetry: ElasticsearchFullTextSearchSyncTelemetry;
  public readonly adapter: ElasticsearchFullTextSearchSyncThirdPartyAdapter;
  public readonly webhook: ElasticsearchFullTextSearchSyncWebhookDispatcher;
  private bridge: ElasticsearchFullTextSearchSyncUniversalBridge | null = null;

  private status: PluginStatus = 'uninitialized';
  private bufferQueue: StreamPayload[] = [];
  private loopTimer: NodeJS.Timeout | null = null;
  private isShuttingDown: boolean = false;

  constructor(options?: Partial<ElasticsearchFullTextSearchSyncEngineConfig>) {
    super();
    this.configManager = new ElasticsearchFullTextSearchSyncConfigManager(options);
    const config = this.configManager.get();
    this.adapter = new ElasticsearchFullTextSearchSyncThirdPartyAdapter();
    this.client = new ElasticsearchFullTextSearchSyncClient(config);
    this.pipeline = new ElasticsearchFullTextSearchSyncPipeline(this.adapter);
    this.telemetry = new ElasticsearchFullTextSearchSyncTelemetry();
    this.webhook = new ElasticsearchFullTextSearchSyncWebhookDispatcher(config.webhookUrl || '', config.webhookSecret || '');
  }

  public async initialize(enableBridge = true): Promise<boolean> {
    const config = this.configManager.get();
    if (!config.enabled) {
      this.status = 'idle' as PluginStatus;
      return false;
    }

    this.status = 'initializing';
    try {
      await this.client.connect();
      this.startRealtimeLoop();

      if (enableBridge && config.bridgePort) {
        this.bridge = new ElasticsearchFullTextSearchSyncUniversalBridge(this, config.bridgePort);
        await this.bridge.start();
      }

      this.status = 'healthy';
      this.emit('ready', { id: this.id, timestamp: Date.now() });
      return true;
    } catch (err: any) {
      this.status = 'degraded';
      this.telemetry.recordError();
      this.emit('error', err);
      return false;
    }
  }

  private startRealtimeLoop(): void {
    if (this.loopTimer) clearInterval(this.loopTimer);
    const config = this.configManager.get();
    const intervalMs = Math.max(1000, config.syncIntervalSec * 1000);

    this.loopTimer = setInterval(async () => {
      if (this.status !== 'healthy' || this.isShuttingDown) return;
      await this.flushBuffer();
    }, intervalMs);
  }

  public async ingest<T = any>(action: MutationAction, data: T): Promise<StreamPayload<T>> {
    const start = Date.now();
    const payload = await this.pipeline.process(action, data);
    this.bufferQueue.push(payload);
    this.telemetry.recordEvent(Date.now() - start);
    this.emit('ingested', payload);

    await this.webhook.dispatch(payload);

    const config = this.configManager.get();
    if (this.bufferQueue.length >= config.maxBatchSize) {
      await this.flushBuffer();
    }

    return payload;
  }

  public async flushBuffer(): Promise<number> {
    if (this.bufferQueue.length === 0) return 0;
    const config = this.configManager.get();
    const batch = this.bufferQueue.splice(0, config.maxBatchSize);

    try {
      const result = await this.client.transmitBatch(batch);
      await this.adapter.dispatchToCustomSinks(batch);
      this.telemetry.recordBatch(result.acknowledgedCount);
      this.emit('flushed', { count: result.acknowledgedCount, latencyMs: result.durationMs });
      return result.acknowledgedCount;
    } catch (err) {
      this.telemetry.recordError();
      this.bufferQueue.unshift(...batch);
      this.emit('error', err);
      return 0;
    }
  }

  public getHealthReport(): HealthReport {
    const config = this.configManager.get();
    return {
      pluginId: this.id,
      version: this.version,
      status: this.status,
      uptimeSeconds: Math.floor(process.uptime()),
      isConnected: this.client.getConnected(),
      endpoint: config.endpoint,
      lastHeartbeat: new Date().toISOString(),
      metrics: this.telemetry.getSnapshot(this.status, this.bufferQueue.length),
      activeFeatures: ["Instant fuzzy search and typo tolerance across database records","Auto-generated phonetic, soundex, and n-gram analyzers","Bulk batch indexing pipeline supporting 50k docs/sec","Compatible with Elasticsearch 8.x and OpenSearch 2.x"],
      activeThirdPartyHooks: this.adapter.getActiveHookNames(),
      thirdPartyLinks: ElasticsearchFullTextSearchSyncIntegrations.EXTERNAL_LINKS
    };
  }

  public getConfig(): ElasticsearchFullTextSearchSyncEngineConfig {
    return this.configManager.get();
  }

  public updateConfig(patch: Partial<ElasticsearchFullTextSearchSyncEngineConfig>): ElasticsearchFullTextSearchSyncEngineConfig {
    return this.configManager.update(patch);
  }

  public async shutdown(): Promise<void> {
    this.isShuttingDown = true;
    if (this.loopTimer) {
      clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
    if (this.bridge) {
      await this.bridge.stop();
      this.bridge = null;
    }
    await this.flushBuffer();
    await this.client.disconnect();
    this.status = 'terminated';
    this.emit('shutdown', { id: this.id });
  }
}

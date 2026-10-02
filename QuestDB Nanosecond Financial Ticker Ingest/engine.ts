/**
 * @file engine.ts
 * @description Core asynchronous orchestrator engine for QuestDB Nanosecond Financial Ticker Ingest.
 * @module @cmox/plugin-questdb-ticker/engine
 */

import { EventEmitter } from 'events';
import {
  QuestDBNanosecondFinancialTickerIngestEngineConfig,
  StreamPayload,
  HealthReport,
  PluginStatus,
  MutationAction
} from './types';
import { QuestDBNanosecondFinancialTickerIngestConfigManager } from './config';
import { QuestDBNanosecondFinancialTickerIngestClient } from './client';
import { QuestDBNanosecondFinancialTickerIngestPipeline } from './pipeline';
import { QuestDBNanosecondFinancialTickerIngestTelemetry } from './telemetry';
import { QuestDBNanosecondFinancialTickerIngestThirdPartyAdapter } from './adapter';
import { QuestDBNanosecondFinancialTickerIngestUniversalBridge } from './bridge';
import { QuestDBNanosecondFinancialTickerIngestWebhookDispatcher } from './webhook';
import { QuestDBNanosecondFinancialTickerIngestIntegrations } from './integrations';

export class QuestDBNanosecondFinancialTickerIngestEngine extends EventEmitter {
  public readonly id = 'questdb-ticker';
  public readonly title = "QuestDB Nanosecond Financial Ticker Ingest";
  public readonly version = 'v1.9.0';
  public readonly category = 'Analytics & OLAP';

  private configManager: QuestDBNanosecondFinancialTickerIngestConfigManager;
  private client: QuestDBNanosecondFinancialTickerIngestClient;
  private pipeline: QuestDBNanosecondFinancialTickerIngestPipeline;
  private telemetry: QuestDBNanosecondFinancialTickerIngestTelemetry;
  public readonly adapter: QuestDBNanosecondFinancialTickerIngestThirdPartyAdapter;
  public readonly webhook: QuestDBNanosecondFinancialTickerIngestWebhookDispatcher;
  private bridge: QuestDBNanosecondFinancialTickerIngestUniversalBridge | null = null;

  private status: PluginStatus = 'uninitialized';
  private bufferQueue: StreamPayload[] = [];
  private loopTimer: NodeJS.Timeout | null = null;
  private isShuttingDown: boolean = false;

  constructor(options?: Partial<QuestDBNanosecondFinancialTickerIngestEngineConfig>) {
    super();
    this.configManager = new QuestDBNanosecondFinancialTickerIngestConfigManager(options);
    const config = this.configManager.get();
    this.adapter = new QuestDBNanosecondFinancialTickerIngestThirdPartyAdapter();
    this.client = new QuestDBNanosecondFinancialTickerIngestClient(config);
    this.pipeline = new QuestDBNanosecondFinancialTickerIngestPipeline(this.adapter);
    this.telemetry = new QuestDBNanosecondFinancialTickerIngestTelemetry();
    this.webhook = new QuestDBNanosecondFinancialTickerIngestWebhookDispatcher(config.webhookUrl || '', config.webhookSecret || '');
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
        this.bridge = new QuestDBNanosecondFinancialTickerIngestUniversalBridge(this, config.bridgePort);
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
      activeFeatures: ["Real-time Streaming","Lock-Free Ring Buffer","Dynamic Backpressure"],
      activeThirdPartyHooks: this.adapter.getActiveHookNames(),
      thirdPartyLinks: QuestDBNanosecondFinancialTickerIngestIntegrations.EXTERNAL_LINKS
    };
  }

  public getConfig(): QuestDBNanosecondFinancialTickerIngestEngineConfig {
    return this.configManager.get();
  }

  public updateConfig(patch: Partial<QuestDBNanosecondFinancialTickerIngestEngineConfig>): QuestDBNanosecondFinancialTickerIngestEngineConfig {
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

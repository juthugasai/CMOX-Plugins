/**
 * @file engine.ts
 * @description Core asynchronous orchestrator engine for Interactive End-to-End Data Lineage Graph.
 * @module @cmox/plugin-data-lineage-graph/engine
 */

import { EventEmitter } from 'events';
import {
  InteractiveEndtoEndDataLineageGraphEngineConfig,
  StreamPayload,
  HealthReport,
  PluginStatus,
  MutationAction
} from './types';
import { InteractiveEndtoEndDataLineageGraphConfigManager } from './config';
import { InteractiveEndtoEndDataLineageGraphClient } from './client';
import { InteractiveEndtoEndDataLineageGraphPipeline } from './pipeline';
import { InteractiveEndtoEndDataLineageGraphTelemetry } from './telemetry';
import { InteractiveEndtoEndDataLineageGraphThirdPartyAdapter } from './adapter';
import { InteractiveEndtoEndDataLineageGraphUniversalBridge } from './bridge';
import { InteractiveEndtoEndDataLineageGraphWebhookDispatcher } from './webhook';
import { InteractiveEndtoEndDataLineageGraphIntegrations } from './integrations';

export class InteractiveEndtoEndDataLineageGraphEngine extends EventEmitter {
  public readonly id = 'data-lineage-graph';
  public readonly title = "Interactive End-to-End Data Lineage Graph";
  public readonly version = 'v3.0.0';
  public readonly category = 'Data Governance';

  private configManager: InteractiveEndtoEndDataLineageGraphConfigManager;
  private client: InteractiveEndtoEndDataLineageGraphClient;
  private pipeline: InteractiveEndtoEndDataLineageGraphPipeline;
  private telemetry: InteractiveEndtoEndDataLineageGraphTelemetry;
  public readonly adapter: InteractiveEndtoEndDataLineageGraphThirdPartyAdapter;
  public readonly webhook: InteractiveEndtoEndDataLineageGraphWebhookDispatcher;
  private bridge: InteractiveEndtoEndDataLineageGraphUniversalBridge | null = null;

  private status: PluginStatus = 'uninitialized';
  private bufferQueue: StreamPayload[] = [];
  private loopTimer: NodeJS.Timeout | null = null;
  private isShuttingDown: boolean = false;

  constructor(options?: Partial<InteractiveEndtoEndDataLineageGraphEngineConfig>) {
    super();
    this.configManager = new InteractiveEndtoEndDataLineageGraphConfigManager(options);
    const config = this.configManager.get();
    this.adapter = new InteractiveEndtoEndDataLineageGraphThirdPartyAdapter();
    this.client = new InteractiveEndtoEndDataLineageGraphClient(config);
    this.pipeline = new InteractiveEndtoEndDataLineageGraphPipeline(this.adapter);
    this.telemetry = new InteractiveEndtoEndDataLineageGraphTelemetry();
    this.webhook = new InteractiveEndtoEndDataLineageGraphWebhookDispatcher(config.webhookUrl || '', config.webhookSecret || '');
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
        this.bridge = new InteractiveEndtoEndDataLineageGraphUniversalBridge(this, config.bridgePort);
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
      thirdPartyLinks: InteractiveEndtoEndDataLineageGraphIntegrations.EXTERNAL_LINKS
    };
  }

  public getConfig(): InteractiveEndtoEndDataLineageGraphEngineConfig {
    return this.configManager.get();
  }

  public updateConfig(patch: Partial<InteractiveEndtoEndDataLineageGraphEngineConfig>): InteractiveEndtoEndDataLineageGraphEngineConfig {
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

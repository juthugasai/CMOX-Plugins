/**
 * @file engine.ts
 * @description Core asynchronous orchestrator engine for GeoJSON & Spatial GIS Data Engine.
 * @module @cmox/plugin-geojson-spatial-engine/engine
 */

import { EventEmitter } from 'events';
import {
  GeoJSONSpatialGISDataEngineEngineConfig,
  StreamPayload,
  HealthReport,
  PluginStatus,
  MutationAction
} from './types';
import { GeoJSONSpatialGISDataEngineConfigManager } from './config';
import { GeoJSONSpatialGISDataEngineClient } from './client';
import { GeoJSONSpatialGISDataEnginePipeline } from './pipeline';
import { GeoJSONSpatialGISDataEngineTelemetry } from './telemetry';
import { GeoJSONSpatialGISDataEngineThirdPartyAdapter } from './adapter';
import { GeoJSONSpatialGISDataEngineUniversalBridge } from './bridge';
import { GeoJSONSpatialGISDataEngineWebhookDispatcher } from './webhook';
import { GeoJSONSpatialGISDataEngineIntegrations } from './integrations';

export class GeoJSONSpatialGISDataEngineEngine extends EventEmitter {
  public readonly id = 'geojson-spatial-engine';
  public readonly title = "GeoJSON & Spatial GIS Data Engine";
  public readonly version = 'v1.7.0';
  public readonly category = 'Import/Export';

  private configManager: GeoJSONSpatialGISDataEngineConfigManager;
  private client: GeoJSONSpatialGISDataEngineClient;
  private pipeline: GeoJSONSpatialGISDataEnginePipeline;
  private telemetry: GeoJSONSpatialGISDataEngineTelemetry;
  public readonly adapter: GeoJSONSpatialGISDataEngineThirdPartyAdapter;
  public readonly webhook: GeoJSONSpatialGISDataEngineWebhookDispatcher;
  private bridge: GeoJSONSpatialGISDataEngineUniversalBridge | null = null;

  private status: PluginStatus = 'uninitialized';
  private bufferQueue: StreamPayload[] = [];
  private loopTimer: NodeJS.Timeout | null = null;
  private isShuttingDown: boolean = false;

  constructor(options?: Partial<GeoJSONSpatialGISDataEngineEngineConfig>) {
    super();
    this.configManager = new GeoJSONSpatialGISDataEngineConfigManager(options);
    const config = this.configManager.get();
    this.adapter = new GeoJSONSpatialGISDataEngineThirdPartyAdapter();
    this.client = new GeoJSONSpatialGISDataEngineClient(config);
    this.pipeline = new GeoJSONSpatialGISDataEnginePipeline(this.adapter);
    this.telemetry = new GeoJSONSpatialGISDataEngineTelemetry();
    this.webhook = new GeoJSONSpatialGISDataEngineWebhookDispatcher(config.webhookUrl || '', config.webhookSecret || '');
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
        this.bridge = new GeoJSONSpatialGISDataEngineUniversalBridge(this, config.bridgePort);
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
      thirdPartyLinks: GeoJSONSpatialGISDataEngineIntegrations.EXTERNAL_LINKS
    };
  }

  public getConfig(): GeoJSONSpatialGISDataEngineEngineConfig {
    return this.configManager.get();
  }

  public updateConfig(patch: Partial<GeoJSONSpatialGISDataEngineEngineConfig>): GeoJSONSpatialGISDataEngineEngineConfig {
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

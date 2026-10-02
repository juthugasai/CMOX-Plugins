/**
 * @file engine.ts
 * @description Core asynchronous orchestrator engine for Notion Database 2-Way Sync Bridge.
 * @module @cmox/plugin-notion-bridge/engine
 */

import { EventEmitter } from 'events';
import {
  NotionDatabase2WaySyncBridgeEngineConfig,
  StreamPayload,
  HealthReport,
  PluginStatus,
  MutationAction
} from './types';
import { NotionDatabase2WaySyncBridgeConfigManager } from './config';
import { NotionDatabase2WaySyncBridgeClient } from './client';
import { NotionDatabase2WaySyncBridgePipeline } from './pipeline';
import { NotionDatabase2WaySyncBridgeTelemetry } from './telemetry';

export class NotionDatabase2WaySyncBridgeEngine extends EventEmitter {
  public readonly id = 'notion-bridge';
  public readonly title = "Notion Database 2-Way Sync Bridge";
  public readonly version = 'v1.9.4';
  public readonly category = 'Connectors';

  private configManager: NotionDatabase2WaySyncBridgeConfigManager;
  private client: NotionDatabase2WaySyncBridgeClient;
  private pipeline: NotionDatabase2WaySyncBridgePipeline;
  private telemetry: NotionDatabase2WaySyncBridgeTelemetry;

  private status: PluginStatus = 'uninitialized';
  private bufferQueue: StreamPayload[] = [];
  private loopTimer: NodeJS.Timeout | null = null;
  private isShuttingDown: boolean = false;

  constructor(options?: Partial<NotionDatabase2WaySyncBridgeEngineConfig>) {
    super();
    this.configManager = new NotionDatabase2WaySyncBridgeConfigManager(options);
    const config = this.configManager.get();
    this.client = new NotionDatabase2WaySyncBridgeClient(config);
    this.pipeline = new NotionDatabase2WaySyncBridgePipeline();
    this.telemetry = new NotionDatabase2WaySyncBridgeTelemetry();
  }

  /**
   * Initializes the plugin runtime and connects to remote or local socket pools.
   */
  public async initialize(): Promise<boolean> {
    const config = this.configManager.get();
    if (!config.enabled) {
      this.status = 'idle' as PluginStatus;
      return false;
    }

    this.status = 'initializing';
    try {
      await this.client.connect();
      this.startRealtimeLoop();
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

  /**
   * Ingests a new mutation or telemetry record into the asynchronous pipeline.
   */
  public async ingest<T = any>(action: MutationAction, data: T): Promise<StreamPayload<T>> {
    const start = Date.now();
    const payload = await this.pipeline.process(action, data);
    this.bufferQueue.push(payload);
    this.telemetry.recordEvent(Date.now() - start);
    this.emit('ingested', payload);

    const config = this.configManager.get();
    if (this.bufferQueue.length >= config.maxBatchSize) {
      await this.flushBuffer();
    }

    return payload;
  }

  /**
   * Flushes queued payloads via the transport client.
   */
  public async flushBuffer(): Promise<number> {
    if (this.bufferQueue.length === 0) return 0;
    const config = this.configManager.get();
    const batch = this.bufferQueue.splice(0, config.maxBatchSize);

    try {
      const result = await this.client.transmitBatch(batch);
      this.telemetry.recordBatch(result.acknowledgedCount);
      this.emit('flushed', { count: result.acknowledgedCount, latencyMs: result.durationMs });
      return result.acknowledgedCount;
    } catch (err) {
      this.telemetry.recordError();
      // Requeue failed payloads
      this.bufferQueue.unshift(...batch);
      this.emit('error', err);
      return 0;
    }
  }

  /**
   * Returns a real-time comprehensive health and performance inspection report.
   */
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
      activeFeatures: ["Real-time Streaming","Lock-Free Ring Buffer","Dynamic Backpressure"]
    };
  }

  public getConfig(): NotionDatabase2WaySyncBridgeEngineConfig {
    return this.configManager.get();
  }

  public updateConfig(patch: Partial<NotionDatabase2WaySyncBridgeEngineConfig>): NotionDatabase2WaySyncBridgeEngineConfig {
    return this.configManager.update(patch);
  }

  /**
   * Graceful shutdown of socket interconnects and background daemon loops.
   */
  public async shutdown(): Promise<void> {
    this.isShuttingDown = true;
    if (this.loopTimer) {
      clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
    await this.flushBuffer();
    await this.client.disconnect();
    this.status = 'terminated';
    this.emit('shutdown', { id: this.id });
  }
}

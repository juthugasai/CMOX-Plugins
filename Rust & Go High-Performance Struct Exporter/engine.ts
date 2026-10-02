/**
 * @file engine.ts
 * @description Core asynchronous orchestrator engine for Rust & Go High-Performance Struct Exporter.
 * @module @cmox/plugin-rust-go-struct-gen/engine
 */

import { EventEmitter } from 'events';
import {
  RustGoHighPerformanceStructExporterEngineConfig,
  StreamPayload,
  HealthReport,
  PluginStatus,
  MutationAction
} from './types';
import { RustGoHighPerformanceStructExporterConfigManager } from './config';
import { RustGoHighPerformanceStructExporterClient } from './client';
import { RustGoHighPerformanceStructExporterPipeline } from './pipeline';
import { RustGoHighPerformanceStructExporterTelemetry } from './telemetry';

export class RustGoHighPerformanceStructExporterEngine extends EventEmitter {
  public readonly id = 'rust-go-struct-gen';
  public readonly title = "Rust & Go High-Performance Struct Exporter";
  public readonly version = 'v2.1.0';
  public readonly category = 'Dev Tools';

  private configManager: RustGoHighPerformanceStructExporterConfigManager;
  private client: RustGoHighPerformanceStructExporterClient;
  private pipeline: RustGoHighPerformanceStructExporterPipeline;
  private telemetry: RustGoHighPerformanceStructExporterTelemetry;

  private status: PluginStatus = 'uninitialized';
  private bufferQueue: StreamPayload[] = [];
  private loopTimer: NodeJS.Timeout | null = null;
  private isShuttingDown: boolean = false;

  constructor(options?: Partial<RustGoHighPerformanceStructExporterEngineConfig>) {
    super();
    this.configManager = new RustGoHighPerformanceStructExporterConfigManager(options);
    const config = this.configManager.get();
    this.client = new RustGoHighPerformanceStructExporterClient(config);
    this.pipeline = new RustGoHighPerformanceStructExporterPipeline();
    this.telemetry = new RustGoHighPerformanceStructExporterTelemetry();
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

  public getConfig(): RustGoHighPerformanceStructExporterEngineConfig {
    return this.configManager.get();
  }

  public updateConfig(patch: Partial<RustGoHighPerformanceStructExporterEngineConfig>): RustGoHighPerformanceStructExporterEngineConfig {
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

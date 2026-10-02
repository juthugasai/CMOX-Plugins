/**
 * @file engine.ts
 * @description Core asynchronous orchestrator engine for Cloudflare Workers D1 & KV Mirror.
 * @module @cmox/plugin-cloudflare-workers-d1/engine
 */

import { EventEmitter } from 'events';
import {
  CloudflareWorkersD1KVMirrorEngineConfig,
  StreamPayload,
  HealthReport,
  PluginStatus,
  MutationAction
} from './types';
import { CloudflareWorkersD1KVMirrorConfigManager } from './config';
import { CloudflareWorkersD1KVMirrorClient } from './client';
import { CloudflareWorkersD1KVMirrorPipeline } from './pipeline';
import { CloudflareWorkersD1KVMirrorTelemetry } from './telemetry';
import { CloudflareWorkersD1KVMirrorThirdPartyAdapter } from './adapter';
import { CloudflareWorkersD1KVMirrorUniversalBridge } from './bridge';

export class CloudflareWorkersD1KVMirrorEngine extends EventEmitter {
  public readonly id = 'cloudflare-workers-d1';
  public readonly title = "Cloudflare Workers D1 & KV Mirror";
  public readonly version = 'v2.9.0';
  public readonly category = 'Cloud & Edge';

  private configManager: CloudflareWorkersD1KVMirrorConfigManager;
  private client: CloudflareWorkersD1KVMirrorClient;
  private pipeline: CloudflareWorkersD1KVMirrorPipeline;
  private telemetry: CloudflareWorkersD1KVMirrorTelemetry;
  public readonly adapter: CloudflareWorkersD1KVMirrorThirdPartyAdapter;
  private bridge: CloudflareWorkersD1KVMirrorUniversalBridge | null = null;

  private status: PluginStatus = 'uninitialized';
  private bufferQueue: StreamPayload[] = [];
  private loopTimer: NodeJS.Timeout | null = null;
  private isShuttingDown: boolean = false;

  constructor(options?: Partial<CloudflareWorkersD1KVMirrorEngineConfig>) {
    super();
    this.configManager = new CloudflareWorkersD1KVMirrorConfigManager(options);
    const config = this.configManager.get();
    this.adapter = new CloudflareWorkersD1KVMirrorThirdPartyAdapter();
    this.client = new CloudflareWorkersD1KVMirrorClient(config);
    this.pipeline = new CloudflareWorkersD1KVMirrorPipeline(this.adapter);
    this.telemetry = new CloudflareWorkersD1KVMirrorTelemetry();
  }

  /**
   * Initializes the plugin runtime, connects sockets, and starts the universal multi-language bridge.
   */
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
        this.bridge = new CloudflareWorkersD1KVMirrorUniversalBridge(this, config.bridgePort);
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
   * Flushes queued payloads via the transport client and third-party custom sinks.
   */
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
      activeFeatures: ["Real-time Streaming","Lock-Free Ring Buffer","Dynamic Backpressure"],
      activeThirdPartyHooks: this.adapter.getActiveHookNames()
    };
  }

  public getConfig(): CloudflareWorkersD1KVMirrorEngineConfig {
    return this.configManager.get();
  }

  public updateConfig(patch: Partial<CloudflareWorkersD1KVMirrorEngineConfig>): CloudflareWorkersD1KVMirrorEngineConfig {
    return this.configManager.update(patch);
  }

  /**
   * Graceful shutdown of socket interconnects, bridge server, and daemon loops.
   */
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

/**
 * @file engine.ts
 * @description Core asynchronous orchestrator engine for AES-256 Hardware Encryption at Rest.
 * @module @cmox/plugin-aes256-encryption/engine
 */

import { EventEmitter } from 'events';
import {
  AES256HardwareEncryptionatRestEngineConfig,
  StreamPayload,
  HealthReport,
  PluginStatus,
  MutationAction
} from './types';
import { AES256HardwareEncryptionatRestConfigManager } from './config';
import { AES256HardwareEncryptionatRestClient } from './client';
import { AES256HardwareEncryptionatRestPipeline } from './pipeline';
import { AES256HardwareEncryptionatRestTelemetry } from './telemetry';
import { AES256HardwareEncryptionatRestThirdPartyAdapter } from './adapter';
import { AES256HardwareEncryptionatRestUniversalBridge } from './bridge';

export class AES256HardwareEncryptionatRestEngine extends EventEmitter {
  public readonly id = 'aes256-encryption';
  public readonly title = "AES-256 Hardware Encryption at Rest";
  public readonly version = 'v5.0.0';
  public readonly category = 'Security & IAM';

  private configManager: AES256HardwareEncryptionatRestConfigManager;
  private client: AES256HardwareEncryptionatRestClient;
  private pipeline: AES256HardwareEncryptionatRestPipeline;
  private telemetry: AES256HardwareEncryptionatRestTelemetry;
  public readonly adapter: AES256HardwareEncryptionatRestThirdPartyAdapter;
  private bridge: AES256HardwareEncryptionatRestUniversalBridge | null = null;

  private status: PluginStatus = 'uninitialized';
  private bufferQueue: StreamPayload[] = [];
  private loopTimer: NodeJS.Timeout | null = null;
  private isShuttingDown: boolean = false;

  constructor(options?: Partial<AES256HardwareEncryptionatRestEngineConfig>) {
    super();
    this.configManager = new AES256HardwareEncryptionatRestConfigManager(options);
    const config = this.configManager.get();
    this.adapter = new AES256HardwareEncryptionatRestThirdPartyAdapter();
    this.client = new AES256HardwareEncryptionatRestClient(config);
    this.pipeline = new AES256HardwareEncryptionatRestPipeline(this.adapter);
    this.telemetry = new AES256HardwareEncryptionatRestTelemetry();
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
        this.bridge = new AES256HardwareEncryptionatRestUniversalBridge(this, config.bridgePort);
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
      activeFeatures: ["Zero-overhead hardware acceleration using CPU AES-NI instructions","Full encryption for tables, JSON files, indexes, and WAL logs","Local master key derivation via Argon2id (100k rounds)","Zero plain-text residual data in RAM or swap files"],
      activeThirdPartyHooks: this.adapter.getActiveHookNames()
    };
  }

  public getConfig(): AES256HardwareEncryptionatRestEngineConfig {
    return this.configManager.get();
  }

  public updateConfig(patch: Partial<AES256HardwareEncryptionatRestEngineConfig>): AES256HardwareEncryptionatRestEngineConfig {
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

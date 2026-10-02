/**
 * @file engine.ts
 * @description Core asynchronous orchestrator engine for GDPR / HIPAA PII Data Anonymizer.
 * @module @cmox/plugin-gdpr-anonymizer/engine
 */

import { EventEmitter } from 'events';
import {
  GDPRHIPAAPIIDataAnonymizerEngineConfig,
  StreamPayload,
  HealthReport,
  PluginStatus,
  MutationAction
} from './types';
import { GDPRHIPAAPIIDataAnonymizerConfigManager } from './config';
import { GDPRHIPAAPIIDataAnonymizerClient } from './client';
import { GDPRHIPAAPIIDataAnonymizerPipeline } from './pipeline';
import { GDPRHIPAAPIIDataAnonymizerTelemetry } from './telemetry';
import { GDPRHIPAAPIIDataAnonymizerThirdPartyAdapter } from './adapter';
import { GDPRHIPAAPIIDataAnonymizerUniversalBridge } from './bridge';
import { GDPRHIPAAPIIDataAnonymizerWebhookDispatcher } from './webhook';
import { GDPRHIPAAPIIDataAnonymizerIntegrations } from './integrations';

export class GDPRHIPAAPIIDataAnonymizerEngine extends EventEmitter {
  public readonly id = 'gdpr-anonymizer';
  public readonly title = "GDPR / HIPAA PII Data Anonymizer";
  public readonly version = 'v3.1.0';
  public readonly category = 'Security & IAM';

  private configManager: GDPRHIPAAPIIDataAnonymizerConfigManager;
  private client: GDPRHIPAAPIIDataAnonymizerClient;
  private pipeline: GDPRHIPAAPIIDataAnonymizerPipeline;
  private telemetry: GDPRHIPAAPIIDataAnonymizerTelemetry;
  public readonly adapter: GDPRHIPAAPIIDataAnonymizerThirdPartyAdapter;
  public readonly webhook: GDPRHIPAAPIIDataAnonymizerWebhookDispatcher;
  private bridge: GDPRHIPAAPIIDataAnonymizerUniversalBridge | null = null;

  private status: PluginStatus = 'uninitialized';
  private bufferQueue: StreamPayload[] = [];
  private loopTimer: NodeJS.Timeout | null = null;
  private isShuttingDown: boolean = false;

  constructor(options?: Partial<GDPRHIPAAPIIDataAnonymizerEngineConfig>) {
    super();
    this.configManager = new GDPRHIPAAPIIDataAnonymizerConfigManager(options);
    const config = this.configManager.get();
    this.adapter = new GDPRHIPAAPIIDataAnonymizerThirdPartyAdapter();
    this.client = new GDPRHIPAAPIIDataAnonymizerClient(config);
    this.pipeline = new GDPRHIPAAPIIDataAnonymizerPipeline(this.adapter);
    this.telemetry = new GDPRHIPAAPIIDataAnonymizerTelemetry();
    this.webhook = new GDPRHIPAAPIIDataAnonymizerWebhookDispatcher(config.webhookUrl || '', config.webhookSecret || '');
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
        this.bridge = new GDPRHIPAAPIIDataAnonymizerUniversalBridge(this, config.bridgePort);
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
      thirdPartyLinks: GDPRHIPAAPIIDataAnonymizerIntegrations.EXTERNAL_LINKS
    };
  }

  public getConfig(): GDPRHIPAAPIIDataAnonymizerEngineConfig {
    return this.configManager.get();
  }

  public updateConfig(patch: Partial<GDPRHIPAAPIIDataAnonymizerEngineConfig>): GDPRHIPAAPIIDataAnonymizerEngineConfig {
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

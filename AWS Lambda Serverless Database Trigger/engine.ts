/**
 * @file engine.ts
 * @description Core asynchronous orchestrator engine for AWS Lambda Serverless Database Trigger.
 * @module @cmox/plugin-lambda-serverless-trigger/engine
 */

import { EventEmitter } from 'events';
import {
  AWSLambdaServerlessDatabaseTriggerEngineConfig,
  StreamPayload,
  HealthReport,
  PluginStatus,
  MutationAction
} from './types';
import { AWSLambdaServerlessDatabaseTriggerConfigManager } from './config';
import { AWSLambdaServerlessDatabaseTriggerClient } from './client';
import { AWSLambdaServerlessDatabaseTriggerPipeline } from './pipeline';
import { AWSLambdaServerlessDatabaseTriggerTelemetry } from './telemetry';
import { AWSLambdaServerlessDatabaseTriggerThirdPartyAdapter } from './adapter';
import { AWSLambdaServerlessDatabaseTriggerUniversalBridge } from './bridge';
import { AWSLambdaServerlessDatabaseTriggerWebhookDispatcher } from './webhook';
import { AWSLambdaServerlessDatabaseTriggerIntegrations } from './integrations';

export class AWSLambdaServerlessDatabaseTriggerEngine extends EventEmitter {
  public readonly id = 'lambda-serverless-trigger';
  public readonly title = "AWS Lambda Serverless Database Trigger";
  public readonly version = 'v2.7.0';
  public readonly category = 'Cloud & Edge';

  private configManager: AWSLambdaServerlessDatabaseTriggerConfigManager;
  private client: AWSLambdaServerlessDatabaseTriggerClient;
  private pipeline: AWSLambdaServerlessDatabaseTriggerPipeline;
  private telemetry: AWSLambdaServerlessDatabaseTriggerTelemetry;
  public readonly adapter: AWSLambdaServerlessDatabaseTriggerThirdPartyAdapter;
  public readonly webhook: AWSLambdaServerlessDatabaseTriggerWebhookDispatcher;
  private bridge: AWSLambdaServerlessDatabaseTriggerUniversalBridge | null = null;

  private status: PluginStatus = 'uninitialized';
  private bufferQueue: StreamPayload[] = [];
  private loopTimer: NodeJS.Timeout | null = null;
  private isShuttingDown: boolean = false;

  constructor(options?: Partial<AWSLambdaServerlessDatabaseTriggerEngineConfig>) {
    super();
    this.configManager = new AWSLambdaServerlessDatabaseTriggerConfigManager(options);
    const config = this.configManager.get();
    this.adapter = new AWSLambdaServerlessDatabaseTriggerThirdPartyAdapter();
    this.client = new AWSLambdaServerlessDatabaseTriggerClient(config);
    this.pipeline = new AWSLambdaServerlessDatabaseTriggerPipeline(this.adapter);
    this.telemetry = new AWSLambdaServerlessDatabaseTriggerTelemetry();
    this.webhook = new AWSLambdaServerlessDatabaseTriggerWebhookDispatcher(config.webhookUrl || '', config.webhookSecret || '');
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
        this.bridge = new AWSLambdaServerlessDatabaseTriggerUniversalBridge(this, config.bridgePort);
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
      thirdPartyLinks: AWSLambdaServerlessDatabaseTriggerIntegrations.EXTERNAL_LINKS
    };
  }

  public getConfig(): AWSLambdaServerlessDatabaseTriggerEngineConfig {
    return this.configManager.get();
  }

  public updateConfig(patch: Partial<AWSLambdaServerlessDatabaseTriggerEngineConfig>): AWSLambdaServerlessDatabaseTriggerEngineConfig {
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

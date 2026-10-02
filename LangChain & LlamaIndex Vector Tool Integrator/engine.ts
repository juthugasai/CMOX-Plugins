/**
 * @file engine.ts
 * @description Core asynchronous orchestrator engine for LangChain & LlamaIndex Vector Tool Integrator.
 * @module @cmox/plugin-langchain-tools/engine
 */

import { EventEmitter } from 'events';
import {
  LangChainLlamaIndexVectorToolIntegratorEngineConfig,
  StreamPayload,
  HealthReport,
  PluginStatus,
  MutationAction
} from './types';
import { LangChainLlamaIndexVectorToolIntegratorConfigManager } from './config';
import { LangChainLlamaIndexVectorToolIntegratorClient } from './client';
import { LangChainLlamaIndexVectorToolIntegratorPipeline } from './pipeline';
import { LangChainLlamaIndexVectorToolIntegratorTelemetry } from './telemetry';
import { LangChainLlamaIndexVectorToolIntegratorThirdPartyAdapter } from './adapter';
import { LangChainLlamaIndexVectorToolIntegratorUniversalBridge } from './bridge';
import { LangChainLlamaIndexVectorToolIntegratorWebhookDispatcher } from './webhook';
import { LangChainLlamaIndexVectorToolIntegratorIntegrations } from './integrations';

export class LangChainLlamaIndexVectorToolIntegratorEngine extends EventEmitter {
  public readonly id = 'langchain-tools';
  public readonly title = "LangChain & LlamaIndex Vector Tool Integrator";
  public readonly version = 'v3.2.0';
  public readonly category = 'AI & Automation';

  private configManager: LangChainLlamaIndexVectorToolIntegratorConfigManager;
  private client: LangChainLlamaIndexVectorToolIntegratorClient;
  private pipeline: LangChainLlamaIndexVectorToolIntegratorPipeline;
  private telemetry: LangChainLlamaIndexVectorToolIntegratorTelemetry;
  public readonly adapter: LangChainLlamaIndexVectorToolIntegratorThirdPartyAdapter;
  public readonly webhook: LangChainLlamaIndexVectorToolIntegratorWebhookDispatcher;
  private bridge: LangChainLlamaIndexVectorToolIntegratorUniversalBridge | null = null;

  private status: PluginStatus = 'uninitialized';
  private bufferQueue: StreamPayload[] = [];
  private loopTimer: NodeJS.Timeout | null = null;
  private isShuttingDown: boolean = false;

  constructor(options?: Partial<LangChainLlamaIndexVectorToolIntegratorEngineConfig>) {
    super();
    this.configManager = new LangChainLlamaIndexVectorToolIntegratorConfigManager(options);
    const config = this.configManager.get();
    this.adapter = new LangChainLlamaIndexVectorToolIntegratorThirdPartyAdapter();
    this.client = new LangChainLlamaIndexVectorToolIntegratorClient(config);
    this.pipeline = new LangChainLlamaIndexVectorToolIntegratorPipeline(this.adapter);
    this.telemetry = new LangChainLlamaIndexVectorToolIntegratorTelemetry();
    this.webhook = new LangChainLlamaIndexVectorToolIntegratorWebhookDispatcher(config.webhookUrl || '', config.webhookSecret || '');
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
        this.bridge = new LangChainLlamaIndexVectorToolIntegratorUniversalBridge(this, config.bridgePort);
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
      thirdPartyLinks: LangChainLlamaIndexVectorToolIntegratorIntegrations.EXTERNAL_LINKS
    };
  }

  public getConfig(): LangChainLlamaIndexVectorToolIntegratorEngineConfig {
    return this.configManager.get();
  }

  public updateConfig(patch: Partial<LangChainLlamaIndexVectorToolIntegratorEngineConfig>): LangChainLlamaIndexVectorToolIntegratorEngineConfig {
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

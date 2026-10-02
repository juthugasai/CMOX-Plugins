/**
 * @file engine.ts
 * @description Core asynchronous orchestrator engine for AI Hub.
 * @module @cmox/plugin-ai-hub/engine
 */

import { EventEmitter } from 'events';
import {
  AIHubEngineConfig,
  StreamPayload,
  HealthReport,
  PluginStatus,
  MutationAction
} from './types';
import { AIHubConfigManager } from './config';
import { AIHubClient } from './client';
import { AIHubPipeline } from './pipeline';
import { AIHubTelemetry } from './telemetry';
import { AIHubThirdPartyAdapter } from './adapter';
import { AIHubUniversalBridge } from './bridge';
import { AIHubWebhookDispatcher } from './webhook';
import { AIHubIntegrations } from './integrations';

export class AIHubEngine extends EventEmitter {
  public readonly id = 'ai-hub';
  public readonly title = "AI Hub";
  public readonly version = 'v3.0.0';
  public readonly category = 'AI & Automation';

  private configManager: AIHubConfigManager;
  private client: AIHubClient;
  private pipeline: AIHubPipeline;
  private telemetry: AIHubTelemetry;
  public readonly adapter: AIHubThirdPartyAdapter;
  public readonly webhook: AIHubWebhookDispatcher;
  private bridge: AIHubUniversalBridge | null = null;

  private status: PluginStatus = 'uninitialized';
  private bufferQueue: StreamPayload[] = [];
  private loopTimer: NodeJS.Timeout | null = null;
  private isShuttingDown: boolean = false;

  constructor(options?: Partial<AIHubEngineConfig>) {
    super();
    this.configManager = new AIHubConfigManager(options);
    const config = this.configManager.get();
    this.adapter = new AIHubThirdPartyAdapter();
    this.client = new AIHubClient(config);
    this.pipeline = new AIHubPipeline(this.adapter);
    this.telemetry = new AIHubTelemetry();
    this.webhook = new AIHubWebhookDispatcher(config.webhookUrl || '', config.webhookSecret || '');
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
        this.bridge = new AIHubUniversalBridge(this, config.bridgePort);
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
      activeFeatures: ["Multi-provider LLM gateway (Google Gemini 3.5, OpenAI GPT-4o, Claude 3.7, Local Ollama)","Autonomous schema blueprint generator from natural language prompts","Real-time text-to-SQL query generation with safety AST guardrails","High-dimensional vector embedding generation & cosine similarity search","Semantic prompt caching with 90%+ latency reduction for repeated analytical queries","Automated slow query remediation & index synthesis"],
      activeThirdPartyHooks: this.adapter.getActiveHookNames(),
      thirdPartyLinks: AIHubIntegrations.EXTERNAL_LINKS
    };
  }

  public getConfig(): AIHubEngineConfig {
    return this.configManager.get();
  }

  public updateConfig(patch: Partial<AIHubEngineConfig>): AIHubEngineConfig {
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

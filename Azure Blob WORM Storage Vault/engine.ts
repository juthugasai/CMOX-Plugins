/**
 * @file engine.ts
 * @description Core asynchronous orchestrator engine for Azure Blob WORM Storage Vault.
 * @module @cmox/plugin-azure-blob-vault/engine
 */

import { EventEmitter } from 'events';
import {
  AzureBlobWORMStorageVaultEngineConfig,
  StreamPayload,
  HealthReport,
  PluginStatus,
  MutationAction
} from './types';
import { AzureBlobWORMStorageVaultConfigManager } from './config';
import { AzureBlobWORMStorageVaultClient } from './client';
import { AzureBlobWORMStorageVaultPipeline } from './pipeline';
import { AzureBlobWORMStorageVaultTelemetry } from './telemetry';
import { AzureBlobWORMStorageVaultThirdPartyAdapter } from './adapter';
import { AzureBlobWORMStorageVaultUniversalBridge } from './bridge';
import { AzureBlobWORMStorageVaultWebhookDispatcher } from './webhook';
import { AzureBlobWORMStorageVaultIntegrations } from './integrations';

export class AzureBlobWORMStorageVaultEngine extends EventEmitter {
  public readonly id = 'azure-blob-vault';
  public readonly title = "Azure Blob WORM Storage Vault";
  public readonly version = 'v1.9.0';
  public readonly category = 'Backup & DR';

  private configManager: AzureBlobWORMStorageVaultConfigManager;
  private client: AzureBlobWORMStorageVaultClient;
  private pipeline: AzureBlobWORMStorageVaultPipeline;
  private telemetry: AzureBlobWORMStorageVaultTelemetry;
  public readonly adapter: AzureBlobWORMStorageVaultThirdPartyAdapter;
  public readonly webhook: AzureBlobWORMStorageVaultWebhookDispatcher;
  private bridge: AzureBlobWORMStorageVaultUniversalBridge | null = null;

  private status: PluginStatus = 'uninitialized';
  private bufferQueue: StreamPayload[] = [];
  private loopTimer: NodeJS.Timeout | null = null;
  private isShuttingDown: boolean = false;

  constructor(options?: Partial<AzureBlobWORMStorageVaultEngineConfig>) {
    super();
    this.configManager = new AzureBlobWORMStorageVaultConfigManager(options);
    const config = this.configManager.get();
    this.adapter = new AzureBlobWORMStorageVaultThirdPartyAdapter();
    this.client = new AzureBlobWORMStorageVaultClient(config);
    this.pipeline = new AzureBlobWORMStorageVaultPipeline(this.adapter);
    this.telemetry = new AzureBlobWORMStorageVaultTelemetry();
    this.webhook = new AzureBlobWORMStorageVaultWebhookDispatcher(config.webhookUrl || '', config.webhookSecret || '');
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
        this.bridge = new AzureBlobWORMStorageVaultUniversalBridge(this, config.bridgePort);
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
      thirdPartyLinks: AzureBlobWORMStorageVaultIntegrations.EXTERNAL_LINKS
    };
  }

  public getConfig(): AzureBlobWORMStorageVaultEngineConfig {
    return this.configManager.get();
  }

  public updateConfig(patch: Partial<AzureBlobWORMStorageVaultEngineConfig>): AzureBlobWORMStorageVaultEngineConfig {
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

/**
 * @file engine.ts
 * @description Core asynchronous orchestrator engine for Regulatory Compliance Report Generator (SOC2/ISO27001).
 * @module @cmox/plugin-regulatory-report-generator/engine
 */

import { EventEmitter } from 'events';
import {
  RegulatoryComplianceReportGeneratorSOC2ISO27001EngineConfig,
  StreamPayload,
  HealthReport,
  PluginStatus,
  MutationAction
} from './types';
import { RegulatoryComplianceReportGeneratorSOC2ISO27001ConfigManager } from './config';
import { RegulatoryComplianceReportGeneratorSOC2ISO27001Client } from './client';
import { RegulatoryComplianceReportGeneratorSOC2ISO27001Pipeline } from './pipeline';
import { RegulatoryComplianceReportGeneratorSOC2ISO27001Telemetry } from './telemetry';
import { RegulatoryComplianceReportGeneratorSOC2ISO27001ThirdPartyAdapter } from './adapter';
import { RegulatoryComplianceReportGeneratorSOC2ISO27001UniversalBridge } from './bridge';

export class RegulatoryComplianceReportGeneratorSOC2ISO27001Engine extends EventEmitter {
  public readonly id = 'regulatory-report-generator';
  public readonly title = "Regulatory Compliance Report Generator (SOC2/ISO27001)";
  public readonly version = 'v2.2.0';
  public readonly category = 'Data Governance';

  private configManager: RegulatoryComplianceReportGeneratorSOC2ISO27001ConfigManager;
  private client: RegulatoryComplianceReportGeneratorSOC2ISO27001Client;
  private pipeline: RegulatoryComplianceReportGeneratorSOC2ISO27001Pipeline;
  private telemetry: RegulatoryComplianceReportGeneratorSOC2ISO27001Telemetry;
  public readonly adapter: RegulatoryComplianceReportGeneratorSOC2ISO27001ThirdPartyAdapter;
  private bridge: RegulatoryComplianceReportGeneratorSOC2ISO27001UniversalBridge | null = null;

  private status: PluginStatus = 'uninitialized';
  private bufferQueue: StreamPayload[] = [];
  private loopTimer: NodeJS.Timeout | null = null;
  private isShuttingDown: boolean = false;

  constructor(options?: Partial<RegulatoryComplianceReportGeneratorSOC2ISO27001EngineConfig>) {
    super();
    this.configManager = new RegulatoryComplianceReportGeneratorSOC2ISO27001ConfigManager(options);
    const config = this.configManager.get();
    this.adapter = new RegulatoryComplianceReportGeneratorSOC2ISO27001ThirdPartyAdapter();
    this.client = new RegulatoryComplianceReportGeneratorSOC2ISO27001Client(config);
    this.pipeline = new RegulatoryComplianceReportGeneratorSOC2ISO27001Pipeline(this.adapter);
    this.telemetry = new RegulatoryComplianceReportGeneratorSOC2ISO27001Telemetry();
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
        this.bridge = new RegulatoryComplianceReportGeneratorSOC2ISO27001UniversalBridge(this, config.bridgePort);
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

  public getConfig(): RegulatoryComplianceReportGeneratorSOC2ISO27001EngineConfig {
    return this.configManager.get();
  }

  public updateConfig(patch: Partial<RegulatoryComplianceReportGeneratorSOC2ISO27001EngineConfig>): RegulatoryComplianceReportGeneratorSOC2ISO27001EngineConfig {
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

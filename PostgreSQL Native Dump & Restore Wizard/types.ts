/**
 * @file types.ts
 * @description Enterprise TypeScript definitions for PostgreSQL Native Dump & Restore Wizard (postgres-native-wizard)
 * @module @cmox/plugin-postgres-native-wizard/types
 * @author CDUS Tech Core
 * @version v3.5.0
 * @license MIT
 */

export type PluginLogLevel = 'debug' | 'info' | 'warn' | 'error';
export type PluginStatus = 'uninitialized' | 'initializing' | 'connected' | 'healthy' | 'degraded' | 'reconnecting' | 'disconnected' | 'terminated';
export type MutationAction = 'insert' | 'update' | 'delete' | 'stream' | 'telemetry' | 'schema_change' | 'audit_event' | 'custom_hook';

export interface PostgreSQLNativeDumpRestoreWizardEngineConfig {
  enabled: boolean;
  autoUpdate: boolean;
  endpoint: string;
  apiKey?: string;
  logLevel: PluginLogLevel;
  syncIntervalSec: number;
  maxBatchSize: number;
  timeoutMs: number;
  retryAttempts: number;
  connectionPoolSize: number;
  backpressureThreshold: number;
  enableEncryption: boolean;
  bridgePort?: number;
  param1?: string;
  param2?: string;
  customOptions?: Record<string, any>;
}

export interface StreamPayload<T = any> {
  id: string;
  sequence: number;
  timestamp: number;
  source: string;
  action: MutationAction;
  data: T;
  checksumSha256: string;
  retryCount?: number;
  metadata?: Record<string, any>;
}

export interface MetricSnapshot {
  timestamp: string;
  pluginId: string;
  status: PluginStatus;
  uptimeSeconds: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  throughputOpsSec: number;
  activeHeapMb: number;
  totalEventsProcessed: number;
  totalBatchesFlushed: number;
  failedEventsCount: number;
  bufferQueueSize: number;
}

export interface HealthReport {
  pluginId: string;
  version: string;
  status: PluginStatus;
  uptimeSeconds: number;
  isConnected: boolean;
  endpoint: string;
  lastHeartbeat: string;
  metrics: MetricSnapshot;
  activeFeatures: string[];
  activeThirdPartyHooks: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  sanitizedData?: any;
}

export type MiddlewareHandler<T = any> = (payload: StreamPayload<T>) => Promise<StreamPayload<T>> | StreamPayload<T>;

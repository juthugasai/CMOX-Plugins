/**
 * @file index.ts
 * @description Main entrypoint for Supabase Realtime WebSocket Replicator extension module.
 * @module @cmox/plugin-supabase-replicator
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './adapter';
export * from './bridge';
export * from './webhook';
export * from './integrations';
export * from './engine';

import { SupabaseRealtimeWebSocketReplicatorEngine } from './engine';
export default SupabaseRealtimeWebSocketReplicatorEngine;

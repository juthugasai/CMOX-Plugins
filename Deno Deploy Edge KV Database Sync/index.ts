/**
 * @file index.ts
 * @description Main entrypoint for Deno Deploy Edge KV Database Sync extension module.
 * @module @cmox/plugin-deno-deploy-kv-sync
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

import { DenoDeployEdgeKVDatabaseSyncEngine } from './engine';
export default DenoDeployEdgeKVDatabaseSyncEngine;

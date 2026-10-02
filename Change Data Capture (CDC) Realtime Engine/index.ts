/**
 * @file index.ts
 * @description Main entrypoint for Change Data Capture (CDC) Realtime Engine extension module.
 * @module @cmox/plugin-change-data-capture
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

import { ChangeDataCaptureCDCRealtimeEngineEngine } from './engine';
export default ChangeDataCaptureCDCRealtimeEngineEngine;

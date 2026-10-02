/**
 * @file index.ts
 * @description Main entrypoint for Smart Auto-Indexer & Schema Tuning AI extension module.
 * @module @cmox/plugin-smart-auto-indexer
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

import { SmartAutoIndexerSchemaTuningAIEngine } from './engine';
export default SmartAutoIndexerSchemaTuningAIEngine;

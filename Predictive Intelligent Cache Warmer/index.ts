/**
 * @file index.ts
 * @description Main entrypoint for Predictive Intelligent Cache Warmer extension module.
 * @module @cmox/plugin-predictive-cache-warmer
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

import { PredictiveIntelligentCacheWarmerEngine } from './engine';
export default PredictiveIntelligentCacheWarmerEngine;

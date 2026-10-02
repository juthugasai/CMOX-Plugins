/**
 * @file index.ts
 * @description Main entrypoint for AI Query Rewrite & Cost Reducer extension module.
 * @module @cmox/plugin-query-cost-reducer
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { AIQueryRewriteCostReducerEngine } from './engine';
export default AIQueryRewriteCostReducerEngine;

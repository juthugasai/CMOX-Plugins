/**
 * @file index.ts
 * @description Main entrypoint for Live Slow Query & Execution Flamegraph extension module.
 * @module @cmox/plugin-slow-query-flamegraph
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './adapter';
export * from './bridge';
export * from './engine';

import { LiveSlowQueryExecutionFlamegraphEngine } from './engine';
export default LiveSlowQueryExecutionFlamegraphEngine;

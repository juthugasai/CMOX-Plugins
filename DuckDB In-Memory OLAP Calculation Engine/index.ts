/**
 * @file index.ts
 * @description Main entrypoint for DuckDB In-Memory OLAP Calculation Engine extension module.
 * @module @cmox/plugin-duckdb-engine
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

import { DuckDBInMemoryOLAPCalculationEngineEngine } from './engine';
export default DuckDBInMemoryOLAPCalculationEngineEngine;

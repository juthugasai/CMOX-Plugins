/**
 * @file index.ts
 * @description Main entrypoint for Presto / Trino SQL Query Federation Layer extension module.
 * @module @cmox/plugin-trino-query-federation
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { PrestoTrinoSQLQueryFederationLayerEngine } from './engine';
export default PrestoTrinoSQLQueryFederationLayerEngine;

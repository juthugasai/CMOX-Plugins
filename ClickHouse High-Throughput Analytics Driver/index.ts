/**
 * @file index.ts
 * @description Main entrypoint for ClickHouse High-Throughput Analytics Driver extension module.
 * @module @cmox/plugin-clickhouse-driver
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { ClickHouseHighThroughputAnalyticsDriverEngine } from './engine';
export default ClickHouseHighThroughputAnalyticsDriverEngine;

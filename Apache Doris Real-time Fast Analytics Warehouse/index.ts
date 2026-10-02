/**
 * @file index.ts
 * @description Main entrypoint for Apache Doris Real-time Fast Analytics Warehouse extension module.
 * @module @cmox/plugin-doris-analytics-warehouse
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

import { ApacheDorisRealtimeFastAnalyticsWarehouseEngine } from './engine';
export default ApacheDorisRealtimeFastAnalyticsWarehouseEngine;

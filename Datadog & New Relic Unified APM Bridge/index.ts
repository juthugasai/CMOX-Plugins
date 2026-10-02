/**
 * @file index.ts
 * @description Main entrypoint for Datadog & New Relic Unified APM Bridge extension module.
 * @module @cmox/plugin-datadog-apm
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { DatadogNewRelicUnifiedAPMBridgeEngine } from './engine';
export default DatadogNewRelicUnifiedAPMBridgeEngine;

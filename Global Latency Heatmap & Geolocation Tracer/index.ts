/**
 * @file index.ts
 * @description Main entrypoint for Global Latency Heatmap & Geolocation Tracer extension module.
 * @module @cmox/plugin-latency-heatmap
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

import { GlobalLatencyHeatmapGeolocationTracerEngine } from './engine';
export default GlobalLatencyHeatmapGeolocationTracerEngine;

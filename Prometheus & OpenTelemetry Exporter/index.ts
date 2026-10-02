/**
 * @file index.ts
 * @description Main entrypoint for Prometheus & OpenTelemetry Exporter extension module.
 * @module @cmox/plugin-prometheus-exporter
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { PrometheusOpenTelemetryExporterEngine } from './engine';
export default PrometheusOpenTelemetryExporterEngine;

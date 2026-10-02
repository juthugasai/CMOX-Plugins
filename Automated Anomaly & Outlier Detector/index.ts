/**
 * @file index.ts
 * @description Main entrypoint for Automated Anomaly & Outlier Detector extension module.
 * @module @cmox/plugin-anomaly-detector
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { AutomatedAnomalyOutlierDetectorEngine } from './engine';
export default AutomatedAnomalyOutlierDetectorEngine;

/**
 * @file index.ts
 * @description Main entrypoint for Schema Drift & Unauthorized DDL Detector extension module.
 * @module @cmox/plugin-schema-drift-detector
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

import { SchemaDriftUnauthorizedDDLDetectorEngine } from './engine';
export default SchemaDriftUnauthorizedDDLDetectorEngine;

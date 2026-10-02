/**
 * @file index.ts
 * @description Main entrypoint for Data Quality & Null Integrity Assertion Suite extension module.
 * @module @cmox/plugin-data-quality-assertions
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { DataQualityNullIntegrityAssertionSuiteEngine } from './engine';
export default DataQualityNullIntegrityAssertionSuiteEngine;

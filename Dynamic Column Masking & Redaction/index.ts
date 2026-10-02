/**
 * @file index.ts
 * @description Main entrypoint for Dynamic Column Masking & Redaction extension module.
 * @module @cmox/plugin-dynamic-column-masking
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { DynamicColumnMaskingRedactionEngine } from './engine';
export default DynamicColumnMaskingRedactionEngine;

/**
 * @file index.ts
 * @description Main entrypoint for Database Health & Resource Sentinel extension module.
 * @module @cmox/plugin-health-sentinel
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { DatabaseHealthResourceSentinelEngine } from './engine';
export default DatabaseHealthResourceSentinelEngine;

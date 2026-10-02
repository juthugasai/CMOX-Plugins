/**
 * @file index.ts
 * @description Main entrypoint for Fastly Compute@Edge Cache Warmer extension module.
 * @module @cmox/plugin-fastly-compute-warmer
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

import { FastlyComputeEdgeCacheWarmerEngine } from './engine';
export default FastlyComputeEdgeCacheWarmerEngine;

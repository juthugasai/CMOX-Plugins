/**
 * @file index.ts
 * @description Main entrypoint for Vercel Edge Serverless Cache Invalidator extension module.
 * @module @cmox/plugin-vercel-cache-invalidator
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { VercelEdgeServerlessCacheInvalidatorEngine } from './engine';
export default VercelEdgeServerlessCacheInvalidatorEngine;

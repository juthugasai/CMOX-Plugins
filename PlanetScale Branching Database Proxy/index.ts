/**
 * @file index.ts
 * @description Main entrypoint for PlanetScale Branching Database Proxy extension module.
 * @module @cmox/plugin-planetscale-proxy
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

import { PlanetScaleBranchingDatabaseProxyEngine } from './engine';
export default PlanetScaleBranchingDatabaseProxyEngine;

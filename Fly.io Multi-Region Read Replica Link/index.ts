/**
 * @file index.ts
 * @description Main entrypoint for Fly.io Multi-Region Read Replica Link extension module.
 * @module @cmox/plugin-flyio-read-replicas
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { FlyioMultiRegionReadReplicaLinkEngine } from './engine';
export default FlyioMultiRegionReadReplicaLinkEngine;

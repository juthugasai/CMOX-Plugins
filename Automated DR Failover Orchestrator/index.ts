/**
 * @file index.ts
 * @description Main entrypoint for Automated DR Failover Orchestrator extension module.
 * @module @cmox/plugin-auto-failover
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { AutomatedDRFailoverOrchestratorEngine } from './engine';
export default AutomatedDRFailoverOrchestratorEngine;

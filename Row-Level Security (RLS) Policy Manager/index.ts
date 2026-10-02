/**
 * @file index.ts
 * @description Main entrypoint for Row-Level Security (RLS) Policy Manager extension module.
 * @module @cmox/plugin-rls-policy-manager
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

import { RowLevelSecurityRLSPolicyManagerEngine } from './engine';
export default RowLevelSecurityRLSPolicyManagerEngine;

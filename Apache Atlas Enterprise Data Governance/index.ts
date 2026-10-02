/**
 * @file index.ts
 * @description Main entrypoint for Apache Atlas Enterprise Data Governance extension module.
 * @module @cmox/plugin-apache-atlas-governance
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

import { ApacheAtlasEnterpriseDataGovernanceEngine } from './engine';
export default ApacheAtlasEnterpriseDataGovernanceEngine;

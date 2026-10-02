/**
 * @file index.ts
 * @description Main entrypoint for Legacy Oracle to CMOX Migration Pipeline extension module.
 * @module @cmox/plugin-oracle-migration-tool
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { LegacyOracletoCMOXMigrationPipelineEngine } from './engine';
export default LegacyOracletoCMOXMigrationPipelineEngine;

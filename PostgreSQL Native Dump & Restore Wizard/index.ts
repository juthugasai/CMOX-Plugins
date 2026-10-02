/**
 * @file index.ts
 * @description Main entrypoint for PostgreSQL Native Dump & Restore Wizard extension module.
 * @module @cmox/plugin-postgres-native-wizard
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

import { PostgreSQLNativeDumpRestoreWizardEngine } from './engine';
export default PostgreSQLNativeDumpRestoreWizardEngine;

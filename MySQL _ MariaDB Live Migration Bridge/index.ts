/**
 * @file index.ts
 * @description Main entrypoint for MySQL / MariaDB Live Migration Bridge extension module.
 * @module @cmox/plugin-mysql-live-bridge
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

import { MySQLMariaDBLiveMigrationBridgeEngine } from './engine';
export default MySQLMariaDBLiveMigrationBridgeEngine;

/**
 * @file index.ts
 * @description Main entrypoint for Interactive SQL & MongoDB Sandbox Playground extension module.
 * @module @cmox/plugin-sql-playground-sandbox
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

import { InteractiveSQLMongoDBSandboxPlaygroundEngine } from './engine';
export default InteractiveSQLMongoDBSandboxPlaygroundEngine;

/**
 * @file index.ts
 * @description Main entrypoint for Database Schema Version Control & Git Diff extension module.
 * @module @cmox/plugin-schema-git-versioning
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

import { DatabaseSchemaVersionControlGitDiffEngine } from './engine';
export default DatabaseSchemaVersionControlGitDiffEngine;

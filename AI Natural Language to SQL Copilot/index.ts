/**
 * @file index.ts
 * @description Main entrypoint for AI Natural Language to SQL Copilot extension module.
 * @module @cmox/plugin-ai-nl-sql-copilot
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

import { AINaturalLanguagetoSQLCopilotEngine } from './engine';
export default AINaturalLanguagetoSQLCopilotEngine;

/**
 * @file index.ts
 * @description Main entrypoint for Natural Language Database Schema Architect extension module.
 * @module @cmox/plugin-schema-architect-ai
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

import { NaturalLanguageDatabaseSchemaArchitectEngine } from './engine';
export default NaturalLanguageDatabaseSchemaArchitectEngine;

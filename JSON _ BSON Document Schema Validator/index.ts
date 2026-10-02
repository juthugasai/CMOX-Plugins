/**
 * @file index.ts
 * @description Main entrypoint for JSON / BSON Document Schema Validator extension module.
 * @module @cmox/plugin-json-validator
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

import { JSONBSONDocumentSchemaValidatorEngine } from './engine';
export default JSONBSONDocumentSchemaValidatorEngine;

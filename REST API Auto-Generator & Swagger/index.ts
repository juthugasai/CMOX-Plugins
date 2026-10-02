/**
 * @file index.ts
 * @description Main entrypoint for REST API Auto-Generator & Swagger extension module.
 * @module @cmox/plugin-rest-generator
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

import { RESTAPIAutoGeneratorSwaggerEngine } from './engine';
export default RESTAPIAutoGeneratorSwaggerEngine;

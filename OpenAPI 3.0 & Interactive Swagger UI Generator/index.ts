/**
 * @file index.ts
 * @description Main entrypoint for OpenAPI 3.0 & Interactive Swagger UI Generator extension module.
 * @module @cmox/plugin-swagger-openapi-ui
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

import { OpenAPI30InteractiveSwaggerUIGeneratorEngine } from './engine';
export default OpenAPI30InteractiveSwaggerUIGeneratorEngine;

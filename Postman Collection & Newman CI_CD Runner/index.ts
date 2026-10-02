/**
 * @file index.ts
 * @description Main entrypoint for Postman Collection & Newman CI/CD Runner extension module.
 * @module @cmox/plugin-postman-newman-ci
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { PostmanCollectionNewmanCICDRunnerEngine } from './engine';
export default PostmanCollectionNewmanCICDRunnerEngine;

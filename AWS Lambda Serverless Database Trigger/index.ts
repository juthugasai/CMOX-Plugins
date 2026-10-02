/**
 * @file index.ts
 * @description Main entrypoint for AWS Lambda Serverless Database Trigger extension module.
 * @module @cmox/plugin-lambda-serverless-trigger
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

import { AWSLambdaServerlessDatabaseTriggerEngine } from './engine';
export default AWSLambdaServerlessDatabaseTriggerEngine;

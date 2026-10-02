/**
 * @file index.ts
 * @description Main entrypoint for MongoDB Bidirectional Bridge extension module.
 * @module @cmox/plugin-mongodb-bridge
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

import { MongoDBBidirectionalBridgeEngine } from './engine';
export default MongoDBBidirectionalBridgeEngine;

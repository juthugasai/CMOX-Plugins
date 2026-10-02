/**
 * @file index.ts
 * @description Main entrypoint for Notion Database 2-Way Sync Bridge extension module.
 * @module @cmox/plugin-notion-bridge
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

import { NotionDatabase2WaySyncBridgeEngine } from './engine';
export default NotionDatabase2WaySyncBridgeEngine;

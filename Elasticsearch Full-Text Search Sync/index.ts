/**
 * @file index.ts
 * @description Main entrypoint for Elasticsearch Full-Text Search Sync extension module.
 * @module @cmox/plugin-elasticsearch-sync
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

import { ElasticsearchFullTextSearchSyncEngine } from './engine';
export default ElasticsearchFullTextSearchSyncEngine;

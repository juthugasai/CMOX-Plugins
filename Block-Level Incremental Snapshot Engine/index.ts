/**
 * @file index.ts
 * @description Main entrypoint for Block-Level Incremental Snapshot Engine extension module.
 * @module @cmox/plugin-incremental-backup
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { BlockLevelIncrementalSnapshotEngineEngine } from './engine';
export default BlockLevelIncrementalSnapshotEngineEngine;

/**
 * @file index.ts
 * @description Main entrypoint for Live Lock Contention & Deadlock Visualizer extension module.
 * @module @cmox/plugin-lock-visualizer
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

import { LiveLockContentionDeadlockVisualizerEngine } from './engine';
export default LiveLockContentionDeadlockVisualizerEngine;

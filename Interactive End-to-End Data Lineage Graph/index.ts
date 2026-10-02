/**
 * @file index.ts
 * @description Main entrypoint for Interactive End-to-End Data Lineage Graph extension module.
 * @module @cmox/plugin-data-lineage-graph
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

import { InteractiveEndtoEndDataLineageGraphEngine } from './engine';
export default InteractiveEndtoEndDataLineageGraphEngine;

/**
 * @file index.ts
 * @description Main entrypoint for TimescaleDB Automated Hypertable Partitioner extension module.
 * @module @cmox/plugin-timescaledb-partitioner
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { TimescaleDBAutomatedHypertablePartitionerEngine } from './engine';
export default TimescaleDBAutomatedHypertablePartitionerEngine;

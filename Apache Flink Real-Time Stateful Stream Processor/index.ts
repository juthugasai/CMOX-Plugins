/**
 * @file index.ts
 * @description Main entrypoint for Apache Flink Real-Time Stateful Stream Processor extension module.
 * @module @cmox/plugin-flink-stream-processor
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { ApacheFlinkRealTimeStatefulStreamProcessorEngine } from './engine';
export default ApacheFlinkRealTimeStatefulStreamProcessorEngine;

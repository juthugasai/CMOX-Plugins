/**
 * @file index.ts
 * @description Main entrypoint for Rust & Go High-Performance Struct Exporter extension module.
 * @module @cmox/plugin-rust-go-struct-gen
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

import { RustGoHighPerformanceStructExporterEngine } from './engine';
export default RustGoHighPerformanceStructExporterEngine;

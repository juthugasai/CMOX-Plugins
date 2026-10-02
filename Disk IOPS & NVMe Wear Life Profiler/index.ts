/**
 * @file index.ts
 * @description Main entrypoint for Disk IOPS & NVMe Wear Life Profiler extension module.
 * @module @cmox/plugin-disk-iops-profiler
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { DiskIOPSNVMeWearLifeProfilerEngine } from './engine';
export default DiskIOPSNVMeWearLifeProfilerEngine;

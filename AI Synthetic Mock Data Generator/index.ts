/**
 * @file index.ts
 * @description Main entrypoint for AI Synthetic Mock Data Generator extension module.
 * @module @cmox/plugin-synthetic-data-generator
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { AISyntheticMockDataGeneratorEngine } from './engine';
export default AISyntheticMockDataGeneratorEngine;

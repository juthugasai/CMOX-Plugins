/**
 * @file index.ts
 * @description Main entrypoint for Sub-Second Point-in-Time Recovery (PITR) extension module.
 * @module @cmox/plugin-pitr-recovery
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

import { SubSecondPointinTimeRecoveryPITREngine } from './engine';
export default SubSecondPointinTimeRecoveryPITREngine;

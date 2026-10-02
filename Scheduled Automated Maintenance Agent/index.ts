/**
 * @file index.ts
 * @description Main entrypoint for Scheduled Automated Maintenance Agent extension module.
 * @module @cmox/plugin-auto-maintenance-agent
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { ScheduledAutomatedMaintenanceAgentEngine } from './engine';
export default ScheduledAutomatedMaintenanceAgentEngine;

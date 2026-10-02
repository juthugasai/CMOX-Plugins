/**
 * @file index.ts
 * @description Main entrypoint for PagerDuty & OpsGenie Incident Dispatcher extension module.
 * @module @cmox/plugin-pagerduty-dispatcher
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

import { PagerDutyOpsGenieIncidentDispatcherEngine } from './engine';
export default PagerDutyOpsGenieIncidentDispatcherEngine;

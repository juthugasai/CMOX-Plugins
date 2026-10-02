/**
 * @file index.ts
 * @description Main entrypoint for SQL Injection Firewall & WAF Engine extension module.
 * @module @cmox/plugin-sqli-firewall
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

import { SQLInjectionFirewallWAFEngineEngine } from './engine';
export default SQLInjectionFirewallWAFEngineEngine;

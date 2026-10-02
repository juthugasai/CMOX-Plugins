/**
 * @file index.ts
 * @description Main entrypoint for Sensitive Data Retention & Expiry Enforcer extension module.
 * @module @cmox/plugin-retention-expiry-enforcer
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './adapter';
export * from './bridge';
export * from './webhook';
export * from './integrations';
export * from './engine';

import { SensitiveDataRetentionExpiryEnforcerEngine } from './engine';
export default SensitiveDataRetentionExpiryEnforcerEngine;

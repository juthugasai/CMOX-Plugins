/**
 * @file index.ts
 * @description Main entrypoint for GDPR / HIPAA PII Data Anonymizer extension module.
 * @module @cmox/plugin-gdpr-anonymizer
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

import { GDPRHIPAAPIIDataAnonymizerEngine } from './engine';
export default GDPRHIPAAPIIDataAnonymizerEngine;

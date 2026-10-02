/**
 * @file index.ts
 * @description Main entrypoint for Automated Data Dictionary & PDF ERD Generator extension module.
 * @module @cmox/plugin-data-dictionary-pdf
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

import { AutomatedDataDictionaryPDFERDGeneratorEngine } from './engine';
export default AutomatedDataDictionaryPDFERDGeneratorEngine;

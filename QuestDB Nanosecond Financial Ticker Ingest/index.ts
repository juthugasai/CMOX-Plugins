/**
 * @file index.ts
 * @description Main entrypoint for QuestDB Nanosecond Financial Ticker Ingest extension module.
 * @module @cmox/plugin-questdb-ticker
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

import { QuestDBNanosecondFinancialTickerIngestEngine } from './engine';
export default QuestDBNanosecondFinancialTickerIngestEngine;

/**
 * @file index.ts
 * @description Main entrypoint for Google BigQuery Synchronous ETL Link extension module.
 * @module @cmox/plugin-bigquery-etl-link
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

import { GoogleBigQuerySynchronousETLLinkEngine } from './engine';
export default GoogleBigQuerySynchronousETLLinkEngine;

/**
 * @file index.ts
 * @description Main entrypoint for Microsoft SQL Server (MSSQL) BCP Ingest extension module.
 * @module @cmox/plugin-mssql-bcp-ingest
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

import { MicrosoftSQLServerMSSQLBCPIngestEngine } from './engine';
export default MicrosoftSQLServerMSSQLBCPIngestEngine;

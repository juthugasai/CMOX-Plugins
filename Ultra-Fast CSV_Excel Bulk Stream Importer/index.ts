/**
 * @file index.ts
 * @description Main entrypoint for Ultra-Fast CSV/Excel Bulk Stream Importer extension module.
 * @module @cmox/plugin-csv-excel-importer
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

import { UltraFastCSVExcelBulkStreamImporterEngine } from './engine';
export default UltraFastCSVExcelBulkStreamImporterEngine;

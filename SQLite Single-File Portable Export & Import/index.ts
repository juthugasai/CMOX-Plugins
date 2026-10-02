/**
 * @file index.ts
 * @description Main entrypoint for SQLite Single-File Portable Export & Import extension module.
 * @module @cmox/plugin-sqlite-portable-export
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

import { SQLiteSingleFilePortableExportImportEngine } from './engine';
export default SQLiteSingleFilePortableExportImportEngine;

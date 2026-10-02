/**
 * @file index.ts
 * @description Main entrypoint for Local NAS & SAN Storage Archiver extension module.
 * @module @cmox/plugin-nas-backup
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

import { LocalNASSANStorageArchiverEngine } from './engine';
export default LocalNASSANStorageArchiverEngine;

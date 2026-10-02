/**
 * @file index.ts
 * @description Main entrypoint for Master Data Management (MDM) Entity Deduplicator extension module.
 * @module @cmox/plugin-mdm-deduplicator
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

import { MasterDataManagementMDMEntityDeduplicatorEngine } from './engine';
export default MasterDataManagementMDMEntityDeduplicatorEngine;

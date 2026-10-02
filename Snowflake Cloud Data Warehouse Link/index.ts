/**
 * @file index.ts
 * @description Main entrypoint for Snowflake Cloud Data Warehouse Link extension module.
 * @module @cmox/plugin-snowflake-sync
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

import { SnowflakeCloudDataWarehouseLinkEngine } from './engine';
export default SnowflakeCloudDataWarehouseLinkEngine;

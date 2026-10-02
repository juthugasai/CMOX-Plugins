/**
 * @file index.ts
 * @description Main entrypoint for Amazon Redshift Analytical Cluster Sync extension module.
 * @module @cmox/plugin-redshift-cluster-sync
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { AmazonRedshiftAnalyticalClusterSyncEngine } from './engine';
export default AmazonRedshiftAnalyticalClusterSyncEngine;

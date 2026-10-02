/**
 * @file index.ts
 * @description Main entrypoint for Multi-Cloud Disaster Replication (AWS+GCP+Azure) extension module.
 * @module @cmox/plugin-multi-cloud-dr
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

import { MultiCloudDisasterReplicationAWSGCPAzureEngine } from './engine';
export default MultiCloudDisasterReplicationAWSGCPAzureEngine;

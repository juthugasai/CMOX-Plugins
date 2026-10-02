/**
 * @file index.ts
 * @description Main entrypoint for Google Cloud Storage (GCS) Nearline Archiver extension module.
 * @module @cmox/plugin-gcs-archiver
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { GoogleCloudStorageGCSNearlineArchiverEngine } from './engine';
export default GoogleCloudStorageGCSNearlineArchiverEngine;

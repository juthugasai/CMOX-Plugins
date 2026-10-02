/**
 * @file index.ts
 * @description Main entrypoint for S3 & MinIO Immutable Archiver extension module.
 * @module @cmox/plugin-s3-snapshot-archiver
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

import { S3MinIOImmutableArchiverEngine } from './engine';
export default S3MinIOImmutableArchiverEngine;

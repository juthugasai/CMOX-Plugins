/**
 * @file index.ts
 * @description Main entrypoint for Azure Blob WORM Storage Vault extension module.
 * @module @cmox/plugin-azure-blob-vault
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { AzureBlobWORMStorageVaultEngine } from './engine';
export default AzureBlobWORMStorageVaultEngine;

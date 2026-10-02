/**
 * @file index.ts
 * @description Main entrypoint for Air-Gapped Cold Storage Vault extension module.
 * @module @cmox/plugin-air-gap-vault
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

import { AirGappedColdStorageVaultEngine } from './engine';
export default AirGappedColdStorageVaultEngine;

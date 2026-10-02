/**
 * @file index.ts
 * @description Main entrypoint for HashiCorp Vault Secrets Integrator extension module.
 * @module @cmox/plugin-vault-secrets
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { HashiCorpVaultSecretsIntegratorEngine } from './engine';
export default HashiCorpVaultSecretsIntegratorEngine;

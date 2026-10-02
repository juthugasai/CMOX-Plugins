/**
 * @file index.ts
 * @description Main entrypoint for AES-256 Hardware Encryption at Rest extension module.
 * @module @cmox/plugin-aes256-encryption
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

import { AES256HardwareEncryptionatRestEngine } from './engine';
export default AES256HardwareEncryptionatRestEngine;

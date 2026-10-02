/**
 * @file index.ts
 * @description Main entrypoint for Quantum-Resistant Kyber Encryption Bridge extension module.
 * @module @cmox/plugin-kyber-quantum-encryption
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

import { QuantumResistantKyberEncryptionBridgeEngine } from './engine';
export default QuantumResistantKyberEncryptionBridgeEngine;

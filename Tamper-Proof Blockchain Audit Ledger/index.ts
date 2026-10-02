/**
 * @file index.ts
 * @description Main entrypoint for Tamper-Proof Blockchain Audit Ledger extension module.
 * @module @cmox/plugin-audit-trail-ledger
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { TamperProofBlockchainAuditLedgerEngine } from './engine';
export default TamperProofBlockchainAuditLedgerEngine;

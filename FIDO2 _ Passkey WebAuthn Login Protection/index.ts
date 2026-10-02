/**
 * @file index.ts
 * @description Main entrypoint for FIDO2 / Passkey WebAuthn Login Protection extension module.
 * @module @cmox/plugin-fido2-passkey
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { FIDO2PasskeyWebAuthnLoginProtectionEngine } from './engine';
export default FIDO2PasskeyWebAuthnLoginProtectionEngine;

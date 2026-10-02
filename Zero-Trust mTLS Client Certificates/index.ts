/**
 * @file index.ts
 * @description Main entrypoint for Zero-Trust mTLS Client Certificates extension module.
 * @module @cmox/plugin-mtls-certificates
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { ZeroTrustmTLSClientCertificatesEngine } from './engine';
export default ZeroTrustmTLSClientCertificatesEngine;

/**
 * @file index.ts
 * @description Main entrypoint for Tailscale Mesh VPN Secure Cluster Node extension module.
 * @module @cmox/plugin-tailscale-mesh-node
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

import { TailscaleMeshVPNSecureClusterNodeEngine } from './engine';
export default TailscaleMeshVPNSecureClusterNodeEngine;

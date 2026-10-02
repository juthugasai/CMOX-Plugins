/**
 * @file index.ts
 * @description Main entrypoint for IP Geofencing & CIDR Whitelist Guard extension module.
 * @module @cmox/plugin-ip-geofencing
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { IPGeofencingCIDRWhitelistGuardEngine } from './engine';
export default IPGeofencingCIDRWhitelistGuardEngine;

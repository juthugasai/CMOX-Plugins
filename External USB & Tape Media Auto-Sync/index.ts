/**
 * @file index.ts
 * @description Main entrypoint for External USB & Tape Media Auto-Sync extension module.
 * @module @cmox/plugin-usb-auto-sync
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

import { ExternalUSBTapeMediaAutoSyncEngine } from './engine';
export default ExternalUSBTapeMediaAutoSyncEngine;

/**
 * @file index.ts
 * @description Main entrypoint for NATS.io Cloud-Native Messaging Driver extension module.
 * @module @cmox/plugin-nats-messaging
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

import { NATSioCloudNativeMessagingDriverEngine } from './engine';
export default NATSioCloudNativeMessagingDriverEngine;

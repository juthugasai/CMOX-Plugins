/**
 * @file index.ts
 * @description Main entrypoint for Netlify Edge GraphQL Webhook Dispatcher extension module.
 * @module @cmox/plugin-netlify-edge-dispatcher
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { NetlifyEdgeGraphQLWebhookDispatcherEngine } from './engine';
export default NetlifyEdgeGraphQLWebhookDispatcherEngine;

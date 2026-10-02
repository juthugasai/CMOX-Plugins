/**
 * @file index.ts
 * @description Main entrypoint for GraphQL Auto-Gateway & Subscriptions extension module.
 * @module @cmox/plugin-graphql-gateway
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

import { GraphQLAutoGatewaySubscriptionsEngine } from './engine';
export default GraphQLAutoGatewaySubscriptionsEngine;

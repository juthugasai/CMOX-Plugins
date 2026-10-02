/**
 * @file index.ts
 * @description Main entrypoint for Kafka Event Stream Connector extension module.
 * @module @cmox/plugin-kafka-connector
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

import { KafkaEventStreamConnectorEngine } from './engine';
export default KafkaEventStreamConnectorEngine;

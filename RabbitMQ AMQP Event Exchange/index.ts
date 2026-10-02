/**
 * @file index.ts
 * @description Main entrypoint for RabbitMQ AMQP Event Exchange extension module.
 * @module @cmox/plugin-rabbitmq-exchange
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

import { RabbitMQAMQPEventExchangeEngine } from './engine';
export default RabbitMQAMQPEventExchangeEngine;

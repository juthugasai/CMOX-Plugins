/**
 * @file index.ts
 * @description Main entrypoint for XML & SOAP Legacy Feed Converter extension module.
 * @module @cmox/plugin-xml-soap-converter
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { XMLSOAPLegacyFeedConverterEngine } from './engine';
export default XMLSOAPLegacyFeedConverterEngine;

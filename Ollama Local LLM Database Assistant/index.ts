/**
 * @file index.ts
 * @description Main entrypoint for Ollama Local LLM Database Assistant extension module.
 * @module @cmox/plugin-ollama-local-llm
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

import { OllamaLocalLLMDatabaseAssistantEngine } from './engine';
export default OllamaLocalLLMDatabaseAssistantEngine;

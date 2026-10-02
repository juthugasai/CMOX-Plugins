/**
 * @file index.ts
 * @description Main entrypoint for Vector Embeddings & Semantic Search Engine extension module.
 * @module @cmox/plugin-vector-embeddings-engine
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

import { VectorEmbeddingsSemanticSearchEngineEngine } from './engine';
export default VectorEmbeddingsSemanticSearchEngineEngine;

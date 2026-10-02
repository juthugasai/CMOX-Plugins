/**
 * @file index.ts
 * @description Main entrypoint for Vision AI Document OCR to Table Pipeline extension module.
 * @module @cmox/plugin-vision-ocr-pipeline
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

import { VisionAIDocumentOCRtoTablePipelineEngine } from './engine';
export default VisionAIDocumentOCRtoTablePipelineEngine;

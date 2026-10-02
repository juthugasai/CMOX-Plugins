/**
 * @file index.ts
 * @description Main entrypoint for CLI Code Generator & Shell Completion Engine extension module.
 * @module @cmox/plugin-cli-generator-zsh
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { CLICodeGeneratorShellCompletionEngineEngine } from './engine';
export default CLICodeGeneratorShellCompletionEngineEngine;

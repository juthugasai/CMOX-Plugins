/**
 * @file index.ts
 * @description Main entrypoint for Prisma, Drizzle & TypeORM Model Generator extension module.
 * @module @cmox/plugin-orm-models-generator
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { PrismaDrizzleTypeORMModelGeneratorEngine } from './engine';
export default PrismaDrizzleTypeORMModelGeneratorEngine;

/**
 * @file index.ts
 * @description Main entrypoint for Drag-and-Drop BI Dashboard & Chart Builder extension module.
 * @module @cmox/plugin-bi-dashboard-builder
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { DragandDropBIDashboardChartBuilderEngine } from './engine';
export default DragandDropBIDashboardChartBuilderEngine;

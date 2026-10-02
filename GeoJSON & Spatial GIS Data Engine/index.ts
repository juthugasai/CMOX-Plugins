/**
 * @file index.ts
 * @description Main entrypoint for GeoJSON & Spatial GIS Data Engine extension module.
 * @module @cmox/plugin-geojson-spatial-engine
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

import { GeoJSONSpatialGISDataEngineEngine } from './engine';
export default GeoJSONSpatialGISDataEngineEngine;

/**
 * @file index.ts
 * @description Main entrypoint for Regulatory Compliance Report Generator (SOC2/ISO27001) extension module.
 * @module @cmox/plugin-regulatory-report-generator
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { RegulatoryComplianceReportGeneratorSOC2ISO27001Engine } from './engine';
export default RegulatoryComplianceReportGeneratorSOC2ISO27001Engine;

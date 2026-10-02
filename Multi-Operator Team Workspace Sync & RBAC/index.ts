/**
 * @file index.ts
 * @description Main entrypoint for Multi-Operator Team Workspace Sync & RBAC extension module.
 * @module @cmox/plugin-team-workspace-rbac
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

import { MultiOperatorTeamWorkspaceSyncRBACEngine } from './engine';
export default MultiOperatorTeamWorkspaceSyncRBACEngine;

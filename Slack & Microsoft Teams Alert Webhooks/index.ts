/**
 * @file index.ts
 * @description Main entrypoint for Slack & Microsoft Teams Alert Webhooks extension module.
 * @module @cmox/plugin-slack-teams-webhooks
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

import { SlackMicrosoftTeamsAlertWebhooksEngine } from './engine';
export default SlackMicrosoftTeamsAlertWebhooksEngine;

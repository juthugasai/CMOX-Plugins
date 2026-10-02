/**
 * @file index.ts
 * @description Main entrypoint for Discord & Telegram Alert Notification Bot extension module.
 * @module @cmox/plugin-telegram-discord-alerts
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './engine';

import { DiscordTelegramAlertNotificationBotEngine } from './engine';
export default DiscordTelegramAlertNotificationBotEngine;

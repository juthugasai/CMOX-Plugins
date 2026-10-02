/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Discord & Telegram Alert Notification Bot.
 * @module @cmox/plugin-telegram-discord-alerts/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class DiscordTelegramAlertNotificationBotIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/telegram-discord-alerts',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Discord%20%26%20Telegram%20Alert%20Notification%20Bot',
    openApiSpec: 'https://api.cmox.io/openapi/v3/telegram-discord-alerts.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-telegram-discord-alerts',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/telegram-discord-alerts/events',
      type: 'webhook',
      enabled: true
    },
    {
      name: 'Prometheus & OpenTelemetry Collector',
      url: 'http://localhost:9090/api/v1/import/prometheus',
      type: 'rest_api',
      enabled: true
    },
    {
      name: 'Datadog APM Ingest Gateway',
      url: 'https://http-intake.logs.datadoghq.com/api/v2/logs',
      type: 'cloud_service',
      enabled: false
    }
  ];

  public getIntegrations(): ThirdPartyIntegrationTarget[] {
    return [...this.integrations];
  }

  public addIntegration(target: ThirdPartyIntegrationTarget): void {
    this.integrations.push(target);
  }
}

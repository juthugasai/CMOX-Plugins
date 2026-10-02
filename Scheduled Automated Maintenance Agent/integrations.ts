/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Scheduled Automated Maintenance Agent.
 * @module @cmox/plugin-auto-maintenance-agent/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class ScheduledAutomatedMaintenanceAgentIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/auto-maintenance-agent',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Scheduled%20Automated%20Maintenance%20Agent',
    openApiSpec: 'https://api.cmox.io/openapi/v3/auto-maintenance-agent.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-auto-maintenance-agent',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/auto-maintenance-agent/events',
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

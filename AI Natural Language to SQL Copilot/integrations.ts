/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for AI Natural Language to SQL Copilot.
 * @module @cmox/plugin-ai-nl-sql-copilot/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class AINaturalLanguagetoSQLCopilotIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/ai-nl-sql-copilot',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/AI%20Natural%20Language%20to%20SQL%20Copilot',
    openApiSpec: 'https://api.cmox.io/openapi/v3/ai-nl-sql-copilot.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-ai-nl-sql-copilot',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/ai-nl-sql-copilot/events',
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

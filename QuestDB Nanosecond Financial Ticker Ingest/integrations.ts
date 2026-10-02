/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for QuestDB Nanosecond Financial Ticker Ingest.
 * @module @cmox/plugin-questdb-ticker/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class QuestDBNanosecondFinancialTickerIngestIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/questdb-ticker',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/QuestDB%20Nanosecond%20Financial%20Ticker%20Ingest',
    openApiSpec: 'https://api.cmox.io/openapi/v3/questdb-ticker.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-questdb-ticker',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/questdb-ticker/events',
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

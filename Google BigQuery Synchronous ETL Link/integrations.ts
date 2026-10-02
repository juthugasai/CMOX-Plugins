/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Google BigQuery Synchronous ETL Link.
 * @module @cmox/plugin-bigquery-etl-link/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class GoogleBigQuerySynchronousETLLinkIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/bigquery-etl-link',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Google%20BigQuery%20Synchronous%20ETL%20Link',
    openApiSpec: 'https://api.cmox.io/openapi/v3/bigquery-etl-link.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-bigquery-etl-link',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/bigquery-etl-link/events',
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

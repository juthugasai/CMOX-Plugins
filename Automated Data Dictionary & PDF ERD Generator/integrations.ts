/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Automated Data Dictionary & PDF ERD Generator.
 * @module @cmox/plugin-data-dictionary-pdf/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class AutomatedDataDictionaryPDFERDGeneratorIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/data-dictionary-pdf',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Automated%20Data%20Dictionary%20%26%20PDF%20ERD%20Generator',
    openApiSpec: 'https://api.cmox.io/openapi/v3/data-dictionary-pdf.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-data-dictionary-pdf',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/data-dictionary-pdf/events',
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

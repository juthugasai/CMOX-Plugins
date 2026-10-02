/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Dynamic Column Masking & Redaction.
 * @module @cmox/plugin-dynamic-column-masking/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class DynamicColumnMaskingRedactionIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/dynamic-column-masking',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Dynamic%20Column%20Masking%20%26%20Redaction',
    openApiSpec: 'https://api.cmox.io/openapi/v3/dynamic-column-masking.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-dynamic-column-masking',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/dynamic-column-masking/events',
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

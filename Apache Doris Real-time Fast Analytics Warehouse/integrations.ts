/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Apache Doris Real-time Fast Analytics Warehouse.
 * @module @cmox/plugin-doris-analytics-warehouse/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class ApacheDorisRealtimeFastAnalyticsWarehouseIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/doris-analytics-warehouse',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Apache%20Doris%20Real-time%20Fast%20Analytics%20Warehouse',
    openApiSpec: 'https://api.cmox.io/openapi/v3/doris-analytics-warehouse.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-doris-analytics-warehouse',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/doris-analytics-warehouse/events',
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

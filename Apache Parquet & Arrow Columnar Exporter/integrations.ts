/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Apache Parquet & Arrow Columnar Exporter.
 * @module @cmox/plugin-parquet-arrow-exporter/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class ApacheParquetArrowColumnarExporterIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/parquet-arrow-exporter',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Apache%20Parquet%20%26%20Arrow%20Columnar%20Exporter',
    openApiSpec: 'https://api.cmox.io/openapi/v3/parquet-arrow-exporter.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-parquet-arrow-exporter',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/parquet-arrow-exporter/events',
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

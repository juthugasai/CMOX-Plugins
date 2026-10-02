/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Ultra-Fast CSV/Excel Bulk Stream Importer.
 * @module @cmox/plugin-csv-excel-importer/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class UltraFastCSVExcelBulkStreamImporterIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/csv-excel-importer',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Ultra-Fast%20CSV_Excel%20Bulk%20Stream%20Importer',
    openApiSpec: 'https://api.cmox.io/openapi/v3/csv-excel-importer.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-csv-excel-importer',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/csv-excel-importer/events',
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

/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for SQLite Single-File Portable Export & Import.
 * @module @cmox/plugin-sqlite-portable-export/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class SQLiteSingleFilePortableExportImportIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/sqlite-portable-export',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/SQLite%20Single-File%20Portable%20Export%20%26%20Import',
    openApiSpec: 'https://api.cmox.io/openapi/v3/sqlite-portable-export.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-sqlite-portable-export',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/sqlite-portable-export/events',
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

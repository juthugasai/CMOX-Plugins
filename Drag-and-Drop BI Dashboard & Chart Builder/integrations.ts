/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Drag-and-Drop BI Dashboard & Chart Builder.
 * @module @cmox/plugin-bi-dashboard-builder/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class DragandDropBIDashboardChartBuilderIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/bi-dashboard-builder',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Drag-and-Drop%20BI%20Dashboard%20%26%20Chart%20Builder',
    openApiSpec: 'https://api.cmox.io/openapi/v3/bi-dashboard-builder.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-bi-dashboard-builder',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/bi-dashboard-builder/events',
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

/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Interactive End-to-End Data Lineage Graph.
 * @module @cmox/plugin-data-lineage-graph/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class InteractiveEndtoEndDataLineageGraphIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/data-lineage-graph',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Interactive%20End-to-End%20Data%20Lineage%20Graph',
    openApiSpec: 'https://api.cmox.io/openapi/v3/data-lineage-graph.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-data-lineage-graph',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/data-lineage-graph/events',
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

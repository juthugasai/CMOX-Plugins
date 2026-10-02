/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for AI Query Rewrite & Cost Reducer.
 * @module @cmox/plugin-query-cost-reducer/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class AIQueryRewriteCostReducerIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/query-cost-reducer',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/AI%20Query%20Rewrite%20%26%20Cost%20Reducer',
    openApiSpec: 'https://api.cmox.io/openapi/v3/query-cost-reducer.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-query-cost-reducer',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/query-cost-reducer/events',
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

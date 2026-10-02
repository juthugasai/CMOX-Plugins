/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Netlify Edge GraphQL Webhook Dispatcher.
 * @module @cmox/plugin-netlify-edge-dispatcher/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class NetlifyEdgeGraphQLWebhookDispatcherIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/netlify-edge-dispatcher',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Netlify%20Edge%20GraphQL%20Webhook%20Dispatcher',
    openApiSpec: 'https://api.cmox.io/openapi/v3/netlify-edge-dispatcher.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-netlify-edge-dispatcher',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/netlify-edge-dispatcher/events',
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

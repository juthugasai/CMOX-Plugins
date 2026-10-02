/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Fly.io Multi-Region Read Replica Link.
 * @module @cmox/plugin-flyio-read-replicas/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class FlyioMultiRegionReadReplicaLinkIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/flyio-read-replicas',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Fly.io%20Multi-Region%20Read%20Replica%20Link',
    openApiSpec: 'https://api.cmox.io/openapi/v3/flyio-read-replicas.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-flyio-read-replicas',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/flyio-read-replicas/events',
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

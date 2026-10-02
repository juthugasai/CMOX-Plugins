/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Change Data Capture (CDC) Realtime Engine.
 * @module @cmox/plugin-change-data-capture/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class ChangeDataCaptureCDCRealtimeEngineIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/change-data-capture',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Change%20Data%20Capture%20(CDC)%20Realtime%20Engine',
    openApiSpec: 'https://api.cmox.io/openapi/v3/change-data-capture.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-change-data-capture',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/change-data-capture/events',
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

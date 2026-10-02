/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Global Latency Heatmap & Geolocation Tracer.
 * @module @cmox/plugin-latency-heatmap/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class GlobalLatencyHeatmapGeolocationTracerIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/latency-heatmap',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Global%20Latency%20Heatmap%20%26%20Geolocation%20Tracer',
    openApiSpec: 'https://api.cmox.io/openapi/v3/latency-heatmap.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-latency-heatmap',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/latency-heatmap/events',
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

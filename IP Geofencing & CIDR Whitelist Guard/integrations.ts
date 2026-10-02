/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for IP Geofencing & CIDR Whitelist Guard.
 * @module @cmox/plugin-ip-geofencing/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class IPGeofencingCIDRWhitelistGuardIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/ip-geofencing',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/IP%20Geofencing%20%26%20CIDR%20Whitelist%20Guard',
    openApiSpec: 'https://api.cmox.io/openapi/v3/ip-geofencing.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-ip-geofencing',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/ip-geofencing/events',
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

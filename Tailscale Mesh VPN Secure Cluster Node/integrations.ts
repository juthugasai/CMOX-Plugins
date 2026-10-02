/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Tailscale Mesh VPN Secure Cluster Node.
 * @module @cmox/plugin-tailscale-mesh-node/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class TailscaleMeshVPNSecureClusterNodeIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/tailscale-mesh-node',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Tailscale%20Mesh%20VPN%20Secure%20Cluster%20Node',
    openApiSpec: 'https://api.cmox.io/openapi/v3/tailscale-mesh-node.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-tailscale-mesh-node',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/tailscale-mesh-node/events',
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

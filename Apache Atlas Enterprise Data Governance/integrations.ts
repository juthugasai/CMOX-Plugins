/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Apache Atlas Enterprise Data Governance.
 * @module @cmox/plugin-apache-atlas-governance/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class ApacheAtlasEnterpriseDataGovernanceIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/apache-atlas-governance',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Apache%20Atlas%20Enterprise%20Data%20Governance',
    openApiSpec: 'https://api.cmox.io/openapi/v3/apache-atlas-governance.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-apache-atlas-governance',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/apache-atlas-governance/events',
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

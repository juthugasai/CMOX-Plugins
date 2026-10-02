/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Row-Level Security (RLS) Policy Manager.
 * @module @cmox/plugin-rls-policy-manager/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class RowLevelSecurityRLSPolicyManagerIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/rls-policy-manager',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Row-Level%20Security%20(RLS)%20Policy%20Manager',
    openApiSpec: 'https://api.cmox.io/openapi/v3/rls-policy-manager.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-rls-policy-manager',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/rls-policy-manager/events',
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

/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for SQL Injection Firewall & WAF Engine.
 * @module @cmox/plugin-sqli-firewall/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class SQLInjectionFirewallWAFEngineIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/sqli-firewall',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/SQL%20Injection%20Firewall%20%26%20WAF%20Engine',
    openApiSpec: 'https://api.cmox.io/openapi/v3/sqli-firewall.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-sqli-firewall',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/sqli-firewall/events',
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

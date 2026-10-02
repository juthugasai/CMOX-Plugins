/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Regulatory Compliance Report Generator (SOC2/ISO27001).
 * @module @cmox/plugin-regulatory-report-generator/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class RegulatoryComplianceReportGeneratorSOC2ISO27001Integrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/regulatory-report-generator',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Regulatory%20Compliance%20Report%20Generator%20(SOC2_ISO27001)',
    openApiSpec: 'https://api.cmox.io/openapi/v3/regulatory-report-generator.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-regulatory-report-generator',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/regulatory-report-generator/events',
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

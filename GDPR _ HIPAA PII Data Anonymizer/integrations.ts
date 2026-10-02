/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for GDPR / HIPAA PII Data Anonymizer.
 * @module @cmox/plugin-gdpr-anonymizer/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class GDPRHIPAAPIIDataAnonymizerIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/gdpr-anonymizer',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/GDPR%20_%20HIPAA%20PII%20Data%20Anonymizer',
    openApiSpec: 'https://api.cmox.io/openapi/v3/gdpr-anonymizer.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-gdpr-anonymizer',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/gdpr-anonymizer/events',
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

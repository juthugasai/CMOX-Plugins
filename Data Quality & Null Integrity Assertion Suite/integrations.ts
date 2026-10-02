/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Data Quality & Null Integrity Assertion Suite.
 * @module @cmox/plugin-data-quality-assertions/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class DataQualityNullIntegrityAssertionSuiteIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/data-quality-assertions',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Data%20Quality%20%26%20Null%20Integrity%20Assertion%20Suite',
    openApiSpec: 'https://api.cmox.io/openapi/v3/data-quality-assertions.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-data-quality-assertions',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/data-quality-assertions/events',
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

/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Datadog & New Relic Unified APM Bridge.
 * @module @cmox/plugin-datadog-apm/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class DatadogNewRelicUnifiedAPMBridgeIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/datadog-apm',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Datadog%20%26%20New%20Relic%20Unified%20APM%20Bridge',
    openApiSpec: 'https://api.cmox.io/openapi/v3/datadog-apm.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-datadog-apm',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/datadog-apm/events',
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

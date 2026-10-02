/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for XML & SOAP Legacy Feed Converter.
 * @module @cmox/plugin-xml-soap-converter/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class XMLSOAPLegacyFeedConverterIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/xml-soap-converter',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/XML%20%26%20SOAP%20Legacy%20Feed%20Converter',
    openApiSpec: 'https://api.cmox.io/openapi/v3/xml-soap-converter.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-xml-soap-converter',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/xml-soap-converter/events',
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

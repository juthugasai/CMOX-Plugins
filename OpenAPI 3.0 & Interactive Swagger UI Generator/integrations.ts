/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for OpenAPI 3.0 & Interactive Swagger UI Generator.
 * @module @cmox/plugin-swagger-openapi-ui/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class OpenAPI30InteractiveSwaggerUIGeneratorIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/swagger-openapi-ui',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/OpenAPI%203.0%20%26%20Interactive%20Swagger%20UI%20Generator',
    openApiSpec: 'https://api.cmox.io/openapi/v3/swagger-openapi-ui.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-swagger-openapi-ui',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/swagger-openapi-ui/events',
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

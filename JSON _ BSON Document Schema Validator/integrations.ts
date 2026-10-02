/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for JSON / BSON Document Schema Validator.
 * @module @cmox/plugin-json-validator/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class JSONBSONDocumentSchemaValidatorIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/json-validator',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/JSON%20_%20BSON%20Document%20Schema%20Validator',
    openApiSpec: 'https://api.cmox.io/openapi/v3/json-validator.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-json-validator',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/json-validator/events',
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

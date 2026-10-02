/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Natural Language Database Schema Architect.
 * @module @cmox/plugin-schema-architect-ai/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class NaturalLanguageDatabaseSchemaArchitectIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/schema-architect-ai',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Natural%20Language%20Database%20Schema%20Architect',
    openApiSpec: 'https://api.cmox.io/openapi/v3/schema-architect-ai.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-schema-architect-ai',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/schema-architect-ai/events',
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

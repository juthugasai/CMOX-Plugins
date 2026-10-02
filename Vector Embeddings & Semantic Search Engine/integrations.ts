/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Vector Embeddings & Semantic Search Engine.
 * @module @cmox/plugin-vector-embeddings-engine/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class VectorEmbeddingsSemanticSearchEngineIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/vector-embeddings-engine',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Vector%20Embeddings%20%26%20Semantic%20Search%20Engine',
    openApiSpec: 'https://api.cmox.io/openapi/v3/vector-embeddings-engine.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-vector-embeddings-engine',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/vector-embeddings-engine/events',
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

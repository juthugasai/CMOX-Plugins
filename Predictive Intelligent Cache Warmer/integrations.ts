/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Predictive Intelligent Cache Warmer.
 * @module @cmox/plugin-predictive-cache-warmer/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class PredictiveIntelligentCacheWarmerIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/predictive-cache-warmer',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Predictive%20Intelligent%20Cache%20Warmer',
    openApiSpec: 'https://api.cmox.io/openapi/v3/predictive-cache-warmer.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-predictive-cache-warmer',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/predictive-cache-warmer/events',
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

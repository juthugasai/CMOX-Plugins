/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Master Data Management (MDM) Entity Deduplicator.
 * @module @cmox/plugin-mdm-deduplicator/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class MasterDataManagementMDMEntityDeduplicatorIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/mdm-deduplicator',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Master%20Data%20Management%20(MDM)%20Entity%20Deduplicator',
    openApiSpec: 'https://api.cmox.io/openapi/v3/mdm-deduplicator.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-mdm-deduplicator',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/mdm-deduplicator/events',
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

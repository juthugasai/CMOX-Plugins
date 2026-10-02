/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Legacy Oracle to CMOX Migration Pipeline.
 * @module @cmox/plugin-oracle-migration-tool/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class LegacyOracletoCMOXMigrationPipelineIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/oracle-migration-tool',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Legacy%20Oracle%20to%20CMOX%20Migration%20Pipeline',
    openApiSpec: 'https://api.cmox.io/openapi/v3/oracle-migration-tool.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-oracle-migration-tool',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/oracle-migration-tool/events',
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

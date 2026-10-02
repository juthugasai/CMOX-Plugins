/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Amazon Redshift Analytical Cluster Sync.
 * @module @cmox/plugin-redshift-cluster-sync/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class AmazonRedshiftAnalyticalClusterSyncIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/redshift-cluster-sync',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Amazon%20Redshift%20Analytical%20Cluster%20Sync',
    openApiSpec: 'https://api.cmox.io/openapi/v3/redshift-cluster-sync.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-redshift-cluster-sync',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/redshift-cluster-sync/events',
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

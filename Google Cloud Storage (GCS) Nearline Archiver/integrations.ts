/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Google Cloud Storage (GCS) Nearline Archiver.
 * @module @cmox/plugin-gcs-archiver/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class GoogleCloudStorageGCSNearlineArchiverIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/gcs-archiver',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Google%20Cloud%20Storage%20(GCS)%20Nearline%20Archiver',
    openApiSpec: 'https://api.cmox.io/openapi/v3/gcs-archiver.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-gcs-archiver',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/gcs-archiver/events',
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

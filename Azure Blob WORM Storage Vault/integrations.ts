/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Azure Blob WORM Storage Vault.
 * @module @cmox/plugin-azure-blob-vault/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class AzureBlobWORMStorageVaultIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/azure-blob-vault',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Azure%20Blob%20WORM%20Storage%20Vault',
    openApiSpec: 'https://api.cmox.io/openapi/v3/azure-blob-vault.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-azure-blob-vault',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/azure-blob-vault/events',
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

/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for HashiCorp Vault Secrets Integrator.
 * @module @cmox/plugin-vault-secrets/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class HashiCorpVaultSecretsIntegratorIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/vault-secrets',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/HashiCorp%20Vault%20Secrets%20Integrator',
    openApiSpec: 'https://api.cmox.io/openapi/v3/vault-secrets.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-vault-secrets',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/vault-secrets/events',
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

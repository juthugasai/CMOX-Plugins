/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for AES-256 Hardware Encryption at Rest.
 * @module @cmox/plugin-aes256-encryption/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class AES256HardwareEncryptionatRestIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/aes256-encryption',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/AES-256%20Hardware%20Encryption%20at%20Rest',
    openApiSpec: 'https://api.cmox.io/openapi/v3/aes256-encryption.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-aes256-encryption',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/aes256-encryption/events',
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

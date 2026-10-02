/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Quantum-Resistant Kyber Encryption Bridge.
 * @module @cmox/plugin-kyber-quantum-encryption/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class QuantumResistantKyberEncryptionBridgeIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/kyber-quantum-encryption',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Quantum-Resistant%20Kyber%20Encryption%20Bridge',
    openApiSpec: 'https://api.cmox.io/openapi/v3/kyber-quantum-encryption.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-kyber-quantum-encryption',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/kyber-quantum-encryption/events',
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

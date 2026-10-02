/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for FIDO2 / Passkey WebAuthn Login Protection.
 * @module @cmox/plugin-fido2-passkey/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class FIDO2PasskeyWebAuthnLoginProtectionIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/fido2-passkey',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/FIDO2%20_%20Passkey%20WebAuthn%20Login%20Protection',
    openApiSpec: 'https://api.cmox.io/openapi/v3/fido2-passkey.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-fido2-passkey',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/fido2-passkey/events',
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

/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Stripe Billing & Webhook Bridge.
 * @module @cmox/plugin-stripe-webhook-bridge/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class StripeBillingWebhookBridgeIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/stripe-webhook-bridge',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Stripe%20Billing%20%26%20Webhook%20Bridge',
    openApiSpec: 'https://api.cmox.io/openapi/v3/stripe-webhook-bridge.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-stripe-webhook-bridge',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/stripe-webhook-bridge/events',
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

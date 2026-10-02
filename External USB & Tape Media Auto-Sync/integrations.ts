/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for External USB & Tape Media Auto-Sync.
 * @module @cmox/plugin-usb-auto-sync/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class ExternalUSBTapeMediaAutoSyncIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/usb-auto-sync',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/External%20USB%20%26%20Tape%20Media%20Auto-Sync',
    openApiSpec: 'https://api.cmox.io/openapi/v3/usb-auto-sync.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-usb-auto-sync',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/usb-auto-sync/events',
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

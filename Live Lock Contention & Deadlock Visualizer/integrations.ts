/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Live Lock Contention & Deadlock Visualizer.
 * @module @cmox/plugin-lock-visualizer/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class LiveLockContentionDeadlockVisualizerIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/lock-visualizer',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Live%20Lock%20Contention%20%26%20Deadlock%20Visualizer',
    openApiSpec: 'https://api.cmox.io/openapi/v3/lock-visualizer.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-lock-visualizer',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/lock-visualizer/events',
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

/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for MySQL / MariaDB Live Migration Bridge.
 * @module @cmox/plugin-mysql-live-bridge/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class MySQLMariaDBLiveMigrationBridgeIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/mysql-live-bridge',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/MySQL%20_%20MariaDB%20Live%20Migration%20Bridge',
    openApiSpec: 'https://api.cmox.io/openapi/v3/mysql-live-bridge.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-mysql-live-bridge',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/mysql-live-bridge/events',
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

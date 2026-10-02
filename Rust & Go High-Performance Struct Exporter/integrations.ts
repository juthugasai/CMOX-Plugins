/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Rust & Go High-Performance Struct Exporter.
 * @module @cmox/plugin-rust-go-struct-gen/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class RustGoHighPerformanceStructExporterIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/rust-go-struct-gen',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Rust%20%26%20Go%20High-Performance%20Struct%20Exporter',
    openApiSpec: 'https://api.cmox.io/openapi/v3/rust-go-struct-gen.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-rust-go-struct-gen',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/rust-go-struct-gen/events',
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

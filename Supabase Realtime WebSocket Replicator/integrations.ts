/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Supabase Realtime WebSocket Replicator.
 * @module @cmox/plugin-supabase-replicator/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class SupabaseRealtimeWebSocketReplicatorIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/supabase-replicator',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Supabase%20Realtime%20WebSocket%20Replicator',
    openApiSpec: 'https://api.cmox.io/openapi/v3/supabase-replicator.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-supabase-replicator',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/supabase-replicator/events',
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

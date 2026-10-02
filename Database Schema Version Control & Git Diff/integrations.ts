/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Database Schema Version Control & Git Diff.
 * @module @cmox/plugin-schema-git-versioning/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class DatabaseSchemaVersionControlGitDiffIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/schema-git-versioning',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Database%20Schema%20Version%20Control%20%26%20Git%20Diff',
    openApiSpec: 'https://api.cmox.io/openapi/v3/schema-git-versioning.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-schema-git-versioning',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/schema-git-versioning/events',
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

/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Prisma, Drizzle & TypeORM Model Generator.
 * @module @cmox/plugin-orm-models-generator/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class PrismaDrizzleTypeORMModelGeneratorIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/orm-models-generator',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Prisma%2C%20Drizzle%20%26%20TypeORM%20Model%20Generator',
    openApiSpec: 'https://api.cmox.io/openapi/v3/orm-models-generator.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-orm-models-generator',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/orm-models-generator/events',
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

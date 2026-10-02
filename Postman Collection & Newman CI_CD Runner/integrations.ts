/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Postman Collection & Newman CI/CD Runner.
 * @module @cmox/plugin-postman-newman-ci/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class PostmanCollectionNewmanCICDRunnerIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/postman-newman-ci',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Postman%20Collection%20%26%20Newman%20CI_CD%20Runner',
    openApiSpec: 'https://api.cmox.io/openapi/v3/postman-newman-ci.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-postman-newman-ci',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/postman-newman-ci/events',
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

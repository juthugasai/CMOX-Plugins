/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Apache Spark Distributed Compute Batch Runner.
 * @module @cmox/plugin-spark-batch-runner/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class ApacheSparkDistributedComputeBatchRunnerIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/spark-batch-runner',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Apache%20Spark%20Distributed%20Compute%20Batch%20Runner',
    openApiSpec: 'https://api.cmox.io/openapi/v3/spark-batch-runner.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-spark-batch-runner',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/spark-batch-runner/events',
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

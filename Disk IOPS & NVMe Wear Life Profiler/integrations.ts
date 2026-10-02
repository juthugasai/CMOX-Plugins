/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Disk IOPS & NVMe Wear Life Profiler.
 * @module @cmox/plugin-disk-iops-profiler/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class DiskIOPSNVMeWearLifeProfilerIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/disk-iops-profiler',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Disk%20IOPS%20%26%20NVMe%20Wear%20Life%20Profiler',
    openApiSpec: 'https://api.cmox.io/openapi/v3/disk-iops-profiler.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-disk-iops-profiler',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/disk-iops-profiler/events',
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

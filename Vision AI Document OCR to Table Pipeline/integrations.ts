/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Vision AI Document OCR to Table Pipeline.
 * @module @cmox/plugin-vision-ocr-pipeline/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class VisionAIDocumentOCRtoTablePipelineIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/vision-ocr-pipeline',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Vision%20AI%20Document%20OCR%20to%20Table%20Pipeline',
    openApiSpec: 'https://api.cmox.io/openapi/v3/vision-ocr-pipeline.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-vision-ocr-pipeline',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/vision-ocr-pipeline/events',
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

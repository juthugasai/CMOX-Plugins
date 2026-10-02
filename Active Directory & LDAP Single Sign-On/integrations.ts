/**
 * @file integrations.ts
 * @description Third-party service connectors, webhooks, and documentation links for Active Directory & LDAP Single Sign-On.
 * @module @cmox/plugin-active-directory-ldap/integrations
 */

import { ThirdPartyIntegrationTarget } from './types';

export class ActiveDirectoryLDAPSingleSignOnIntegrations {
  public static readonly EXTERNAL_LINKS: Record<string, string> = {
    officialDocs: 'https://docs.cmox.io/extensions/active-directory-ldap',
    githubRepo: 'https://github.com/juthugasai/CMOX-Plugins/tree/main/Active%20Directory%20%26%20LDAP%20Single%20Sign-On',
    openApiSpec: 'https://api.cmox.io/openapi/v3/active-directory-ldap.json',
    prometheusGrafana: 'https://grafana.com/dashboards/cmox-active-directory-ldap',
    slackCommunity: 'https://cmox.io/community/slack',
    supportPortal: 'https://support.cmox.io/tickets/new'
  };

  private integrations: ThirdPartyIntegrationTarget[] = [
    {
      name: 'CMOX Cloud Webhook Relayer',
      url: 'https://api.cmox.io/v1/plugins/active-directory-ldap/events',
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

/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Slack & Microsoft Teams Alert Webhooks.
 * @module @cmox/plugin-slack-teams-webhooks/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { SlackMicrosoftTeamsAlertWebhooksGuardrails } from './guardrails';
import { SlackMicrosoftTeamsAlertWebhooksThirdPartyAdapter } from './adapter';

export class SlackMicrosoftTeamsAlertWebhooksPipeline {
  private guardrails: SlackMicrosoftTeamsAlertWebhooksGuardrails;
  private adapter: SlackMicrosoftTeamsAlertWebhooksThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: SlackMicrosoftTeamsAlertWebhooksThirdPartyAdapter) {
    this.guardrails = new SlackMicrosoftTeamsAlertWebhooksGuardrails();
    this.adapter = adapter || new SlackMicrosoftTeamsAlertWebhooksThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Slack & Microsoft Teams Alert Webhooks Pipeline] Validation failed: ${validation.errors.join(', ')}`);
    }

    this.sequenceCounter++;
    const payloadJson = JSON.stringify(validation.sanitizedData);
    const checksum = createHash('sha256').update(payloadJson).digest('hex');

    let envelope: StreamPayload<T> = {
      id: `evt_${Date.now()}_${this.sequenceCounter}`,
      sequence: this.sequenceCounter,
      timestamp: Date.now(),
      source,
      action,
      data: validation.sanitizedData,
      checksumSha256: checksum
    };

    envelope = await this.adapter.executePreIngest(envelope);
    return envelope;
  }
}

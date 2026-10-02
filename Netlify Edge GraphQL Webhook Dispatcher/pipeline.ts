/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Netlify Edge GraphQL Webhook Dispatcher.
 * @module @cmox/plugin-netlify-edge-dispatcher/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { NetlifyEdgeGraphQLWebhookDispatcherGuardrails } from './guardrails';
import { NetlifyEdgeGraphQLWebhookDispatcherThirdPartyAdapter } from './adapter';

export class NetlifyEdgeGraphQLWebhookDispatcherPipeline {
  private guardrails: NetlifyEdgeGraphQLWebhookDispatcherGuardrails;
  private adapter: NetlifyEdgeGraphQLWebhookDispatcherThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: NetlifyEdgeGraphQLWebhookDispatcherThirdPartyAdapter) {
    this.guardrails = new NetlifyEdgeGraphQLWebhookDispatcherGuardrails();
    this.adapter = adapter || new NetlifyEdgeGraphQLWebhookDispatcherThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Netlify Edge GraphQL Webhook Dispatcher Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

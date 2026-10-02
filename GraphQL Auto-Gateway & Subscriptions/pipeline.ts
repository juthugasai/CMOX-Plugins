/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for GraphQL Auto-Gateway & Subscriptions.
 * @module @cmox/plugin-graphql-gateway/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { GraphQLAutoGatewaySubscriptionsGuardrails } from './guardrails';
import { GraphQLAutoGatewaySubscriptionsThirdPartyAdapter } from './adapter';

export class GraphQLAutoGatewaySubscriptionsPipeline {
  private guardrails: GraphQLAutoGatewaySubscriptionsGuardrails;
  private adapter: GraphQLAutoGatewaySubscriptionsThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: GraphQLAutoGatewaySubscriptionsThirdPartyAdapter) {
    this.guardrails = new GraphQLAutoGatewaySubscriptionsGuardrails();
    this.adapter = adapter || new GraphQLAutoGatewaySubscriptionsThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[GraphQL Auto-Gateway & Subscriptions Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Fly.io Multi-Region Read Replica Link.
 * @module @cmox/plugin-flyio-read-replicas/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { FlyioMultiRegionReadReplicaLinkGuardrails } from './guardrails';
import { FlyioMultiRegionReadReplicaLinkThirdPartyAdapter } from './adapter';

export class FlyioMultiRegionReadReplicaLinkPipeline {
  private guardrails: FlyioMultiRegionReadReplicaLinkGuardrails;
  private adapter: FlyioMultiRegionReadReplicaLinkThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: FlyioMultiRegionReadReplicaLinkThirdPartyAdapter) {
    this.guardrails = new FlyioMultiRegionReadReplicaLinkGuardrails();
    this.adapter = adapter || new FlyioMultiRegionReadReplicaLinkThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Fly.io Multi-Region Read Replica Link Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

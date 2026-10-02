/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Cloudflare Workers D1 & KV Mirror.
 * @module @cmox/plugin-cloudflare-workers-d1/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { CloudflareWorkersD1KVMirrorGuardrails } from './guardrails';
import { CloudflareWorkersD1KVMirrorThirdPartyAdapter } from './adapter';

export class CloudflareWorkersD1KVMirrorPipeline {
  private guardrails: CloudflareWorkersD1KVMirrorGuardrails;
  private adapter: CloudflareWorkersD1KVMirrorThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: CloudflareWorkersD1KVMirrorThirdPartyAdapter) {
    this.guardrails = new CloudflareWorkersD1KVMirrorGuardrails();
    this.adapter = adapter || new CloudflareWorkersD1KVMirrorThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Cloudflare Workers D1 & KV Mirror Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

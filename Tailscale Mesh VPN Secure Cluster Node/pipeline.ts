/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Tailscale Mesh VPN Secure Cluster Node.
 * @module @cmox/plugin-tailscale-mesh-node/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { TailscaleMeshVPNSecureClusterNodeGuardrails } from './guardrails';
import { TailscaleMeshVPNSecureClusterNodeThirdPartyAdapter } from './adapter';

export class TailscaleMeshVPNSecureClusterNodePipeline {
  private guardrails: TailscaleMeshVPNSecureClusterNodeGuardrails;
  private adapter: TailscaleMeshVPNSecureClusterNodeThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: TailscaleMeshVPNSecureClusterNodeThirdPartyAdapter) {
    this.guardrails = new TailscaleMeshVPNSecureClusterNodeGuardrails();
    this.adapter = adapter || new TailscaleMeshVPNSecureClusterNodeThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Tailscale Mesh VPN Secure Cluster Node Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

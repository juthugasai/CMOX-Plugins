/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Zero-Trust mTLS Client Certificates.
 * @module @cmox/plugin-mtls-certificates/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { ZeroTrustmTLSClientCertificatesGuardrails } from './guardrails';
import { ZeroTrustmTLSClientCertificatesThirdPartyAdapter } from './adapter';

export class ZeroTrustmTLSClientCertificatesPipeline {
  private guardrails: ZeroTrustmTLSClientCertificatesGuardrails;
  private adapter: ZeroTrustmTLSClientCertificatesThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: ZeroTrustmTLSClientCertificatesThirdPartyAdapter) {
    this.guardrails = new ZeroTrustmTLSClientCertificatesGuardrails();
    this.adapter = adapter || new ZeroTrustmTLSClientCertificatesThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Zero-Trust mTLS Client Certificates Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

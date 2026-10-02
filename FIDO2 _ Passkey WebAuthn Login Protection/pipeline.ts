/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for FIDO2 / Passkey WebAuthn Login Protection.
 * @module @cmox/plugin-fido2-passkey/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { FIDO2PasskeyWebAuthnLoginProtectionGuardrails } from './guardrails';
import { FIDO2PasskeyWebAuthnLoginProtectionThirdPartyAdapter } from './adapter';

export class FIDO2PasskeyWebAuthnLoginProtectionPipeline {
  private guardrails: FIDO2PasskeyWebAuthnLoginProtectionGuardrails;
  private adapter: FIDO2PasskeyWebAuthnLoginProtectionThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: FIDO2PasskeyWebAuthnLoginProtectionThirdPartyAdapter) {
    this.guardrails = new FIDO2PasskeyWebAuthnLoginProtectionGuardrails();
    this.adapter = adapter || new FIDO2PasskeyWebAuthnLoginProtectionThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    // Stage 1: Guardrail & Rate Limiting
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[FIDO2 / Passkey WebAuthn Login Protection Pipeline] Validation failed: ${validation.errors.join(', ')}`);
    }

    // Stage 2: Normalization & Sequencing
    this.sequenceCounter++;
    const payloadJson = JSON.stringify(validation.sanitizedData);

    // Stage 3: Cryptographic Integrity Checksum (SHA-256)
    const checksum = createHash('sha256').update(payloadJson).digest('hex');

    // Stage 4: Envelope Construction
    let envelope: StreamPayload<T> = {
      id: `evt_${Date.now()}_${this.sequenceCounter}`,
      sequence: this.sequenceCounter,
      timestamp: Date.now(),
      source,
      action,
      data: validation.sanitizedData,
      checksumSha256: checksum
    };

    // Stage 5: Third-party Pre-Ingest Middleware Interception
    envelope = await this.adapter.executePreIngest(envelope);

    return envelope;
  }
}

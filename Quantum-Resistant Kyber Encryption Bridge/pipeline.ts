/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Quantum-Resistant Kyber Encryption Bridge.
 * @module @cmox/plugin-kyber-quantum-encryption/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { QuantumResistantKyberEncryptionBridgeGuardrails } from './guardrails';
import { QuantumResistantKyberEncryptionBridgeThirdPartyAdapter } from './adapter';

export class QuantumResistantKyberEncryptionBridgePipeline {
  private guardrails: QuantumResistantKyberEncryptionBridgeGuardrails;
  private adapter: QuantumResistantKyberEncryptionBridgeThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: QuantumResistantKyberEncryptionBridgeThirdPartyAdapter) {
    this.guardrails = new QuantumResistantKyberEncryptionBridgeGuardrails();
    this.adapter = adapter || new QuantumResistantKyberEncryptionBridgeThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Quantum-Resistant Kyber Encryption Bridge Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for MySQL / MariaDB Live Migration Bridge.
 * @module @cmox/plugin-mysql-live-bridge/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { MySQLMariaDBLiveMigrationBridgeGuardrails } from './guardrails';
import { MySQLMariaDBLiveMigrationBridgeThirdPartyAdapter } from './adapter';

export class MySQLMariaDBLiveMigrationBridgePipeline {
  private guardrails: MySQLMariaDBLiveMigrationBridgeGuardrails;
  private adapter: MySQLMariaDBLiveMigrationBridgeThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: MySQLMariaDBLiveMigrationBridgeThirdPartyAdapter) {
    this.guardrails = new MySQLMariaDBLiveMigrationBridgeGuardrails();
    this.adapter = adapter || new MySQLMariaDBLiveMigrationBridgeThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[MySQL / MariaDB Live Migration Bridge Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

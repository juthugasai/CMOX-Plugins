/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Rust & Go High-Performance Struct Exporter.
 * @module @cmox/plugin-rust-go-struct-gen/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { RustGoHighPerformanceStructExporterGuardrails } from './guardrails';
import { RustGoHighPerformanceStructExporterThirdPartyAdapter } from './adapter';

export class RustGoHighPerformanceStructExporterPipeline {
  private guardrails: RustGoHighPerformanceStructExporterGuardrails;
  private adapter: RustGoHighPerformanceStructExporterThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: RustGoHighPerformanceStructExporterThirdPartyAdapter) {
    this.guardrails = new RustGoHighPerformanceStructExporterGuardrails();
    this.adapter = adapter || new RustGoHighPerformanceStructExporterThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Rust & Go High-Performance Struct Exporter Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

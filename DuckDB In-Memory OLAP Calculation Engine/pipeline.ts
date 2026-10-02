/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for DuckDB In-Memory OLAP Calculation Engine.
 * @module @cmox/plugin-duckdb-engine/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { DuckDBInMemoryOLAPCalculationEngineGuardrails } from './guardrails';
import { DuckDBInMemoryOLAPCalculationEngineThirdPartyAdapter } from './adapter';

export class DuckDBInMemoryOLAPCalculationEnginePipeline {
  private guardrails: DuckDBInMemoryOLAPCalculationEngineGuardrails;
  private adapter: DuckDBInMemoryOLAPCalculationEngineThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: DuckDBInMemoryOLAPCalculationEngineThirdPartyAdapter) {
    this.guardrails = new DuckDBInMemoryOLAPCalculationEngineGuardrails();
    this.adapter = adapter || new DuckDBInMemoryOLAPCalculationEngineThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[DuckDB In-Memory OLAP Calculation Engine Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

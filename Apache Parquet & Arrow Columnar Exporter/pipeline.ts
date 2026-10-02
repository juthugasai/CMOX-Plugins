/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Apache Parquet & Arrow Columnar Exporter.
 * @module @cmox/plugin-parquet-arrow-exporter/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { ApacheParquetArrowColumnarExporterGuardrails } from './guardrails';
import { ApacheParquetArrowColumnarExporterThirdPartyAdapter } from './adapter';

export class ApacheParquetArrowColumnarExporterPipeline {
  private guardrails: ApacheParquetArrowColumnarExporterGuardrails;
  private adapter: ApacheParquetArrowColumnarExporterThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: ApacheParquetArrowColumnarExporterThirdPartyAdapter) {
    this.guardrails = new ApacheParquetArrowColumnarExporterGuardrails();
    this.adapter = adapter || new ApacheParquetArrowColumnarExporterThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Apache Parquet & Arrow Columnar Exporter Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

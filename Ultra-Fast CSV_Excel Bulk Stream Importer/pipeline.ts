/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Ultra-Fast CSV/Excel Bulk Stream Importer.
 * @module @cmox/plugin-csv-excel-importer/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { UltraFastCSVExcelBulkStreamImporterGuardrails } from './guardrails';
import { UltraFastCSVExcelBulkStreamImporterThirdPartyAdapter } from './adapter';

export class UltraFastCSVExcelBulkStreamImporterPipeline {
  private guardrails: UltraFastCSVExcelBulkStreamImporterGuardrails;
  private adapter: UltraFastCSVExcelBulkStreamImporterThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: UltraFastCSVExcelBulkStreamImporterThirdPartyAdapter) {
    this.guardrails = new UltraFastCSVExcelBulkStreamImporterGuardrails();
    this.adapter = adapter || new UltraFastCSVExcelBulkStreamImporterThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Ultra-Fast CSV/Excel Bulk Stream Importer Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

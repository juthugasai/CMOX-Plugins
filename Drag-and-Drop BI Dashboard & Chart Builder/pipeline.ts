/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Drag-and-Drop BI Dashboard & Chart Builder.
 * @module @cmox/plugin-bi-dashboard-builder/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { DragandDropBIDashboardChartBuilderGuardrails } from './guardrails';
import { DragandDropBIDashboardChartBuilderThirdPartyAdapter } from './adapter';

export class DragandDropBIDashboardChartBuilderPipeline {
  private guardrails: DragandDropBIDashboardChartBuilderGuardrails;
  private adapter: DragandDropBIDashboardChartBuilderThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: DragandDropBIDashboardChartBuilderThirdPartyAdapter) {
    this.guardrails = new DragandDropBIDashboardChartBuilderGuardrails();
    this.adapter = adapter || new DragandDropBIDashboardChartBuilderThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    // Stage 1: Guardrail & Rate Limiting
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Drag-and-Drop BI Dashboard & Chart Builder Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

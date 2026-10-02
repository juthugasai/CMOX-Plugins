/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Automated Anomaly & Outlier Detector.
 * @module @cmox/plugin-anomaly-detector/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { AutomatedAnomalyOutlierDetectorGuardrails } from './guardrails';
import { AutomatedAnomalyOutlierDetectorThirdPartyAdapter } from './adapter';

export class AutomatedAnomalyOutlierDetectorPipeline {
  private guardrails: AutomatedAnomalyOutlierDetectorGuardrails;
  private adapter: AutomatedAnomalyOutlierDetectorThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: AutomatedAnomalyOutlierDetectorThirdPartyAdapter) {
    this.guardrails = new AutomatedAnomalyOutlierDetectorGuardrails();
    this.adapter = adapter || new AutomatedAnomalyOutlierDetectorThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Automated Anomaly & Outlier Detector Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

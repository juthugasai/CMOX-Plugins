/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Regulatory Compliance Report Generator (SOC2/ISO27001).
 * @module @cmox/plugin-regulatory-report-generator/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { RegulatoryComplianceReportGeneratorSOC2ISO27001Guardrails } from './guardrails';
import { RegulatoryComplianceReportGeneratorSOC2ISO27001ThirdPartyAdapter } from './adapter';

export class RegulatoryComplianceReportGeneratorSOC2ISO27001Pipeline {
  private guardrails: RegulatoryComplianceReportGeneratorSOC2ISO27001Guardrails;
  private adapter: RegulatoryComplianceReportGeneratorSOC2ISO27001ThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: RegulatoryComplianceReportGeneratorSOC2ISO27001ThirdPartyAdapter) {
    this.guardrails = new RegulatoryComplianceReportGeneratorSOC2ISO27001Guardrails();
    this.adapter = adapter || new RegulatoryComplianceReportGeneratorSOC2ISO27001ThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    // Stage 1: Guardrail & Rate Limiting
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Regulatory Compliance Report Generator (SOC2/ISO27001) Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

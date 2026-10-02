/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for AWS Lambda Serverless Database Trigger.
 * @module @cmox/plugin-lambda-serverless-trigger/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { AWSLambdaServerlessDatabaseTriggerGuardrails } from './guardrails';
import { AWSLambdaServerlessDatabaseTriggerThirdPartyAdapter } from './adapter';

export class AWSLambdaServerlessDatabaseTriggerPipeline {
  private guardrails: AWSLambdaServerlessDatabaseTriggerGuardrails;
  private adapter: AWSLambdaServerlessDatabaseTriggerThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: AWSLambdaServerlessDatabaseTriggerThirdPartyAdapter) {
    this.guardrails = new AWSLambdaServerlessDatabaseTriggerGuardrails();
    this.adapter = adapter || new AWSLambdaServerlessDatabaseTriggerThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    // Stage 1: Guardrail & Rate Limiting
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[AWS Lambda Serverless Database Trigger Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

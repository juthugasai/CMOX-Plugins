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
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[AWS Lambda Serverless Database Trigger Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

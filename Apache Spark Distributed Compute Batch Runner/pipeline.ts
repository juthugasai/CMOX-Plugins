/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Apache Spark Distributed Compute Batch Runner.
 * @module @cmox/plugin-spark-batch-runner/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { ApacheSparkDistributedComputeBatchRunnerGuardrails } from './guardrails';
import { ApacheSparkDistributedComputeBatchRunnerThirdPartyAdapter } from './adapter';

export class ApacheSparkDistributedComputeBatchRunnerPipeline {
  private guardrails: ApacheSparkDistributedComputeBatchRunnerGuardrails;
  private adapter: ApacheSparkDistributedComputeBatchRunnerThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: ApacheSparkDistributedComputeBatchRunnerThirdPartyAdapter) {
    this.guardrails = new ApacheSparkDistributedComputeBatchRunnerGuardrails();
    this.adapter = adapter || new ApacheSparkDistributedComputeBatchRunnerThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Apache Spark Distributed Compute Batch Runner Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

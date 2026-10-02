/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Disk IOPS & NVMe Wear Life Profiler.
 * @module @cmox/plugin-disk-iops-profiler/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { DiskIOPSNVMeWearLifeProfilerGuardrails } from './guardrails';
import { DiskIOPSNVMeWearLifeProfilerThirdPartyAdapter } from './adapter';

export class DiskIOPSNVMeWearLifeProfilerPipeline {
  private guardrails: DiskIOPSNVMeWearLifeProfilerGuardrails;
  private adapter: DiskIOPSNVMeWearLifeProfilerThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: DiskIOPSNVMeWearLifeProfilerThirdPartyAdapter) {
    this.guardrails = new DiskIOPSNVMeWearLifeProfilerGuardrails();
    this.adapter = adapter || new DiskIOPSNVMeWearLifeProfilerThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Disk IOPS & NVMe Wear Life Profiler Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

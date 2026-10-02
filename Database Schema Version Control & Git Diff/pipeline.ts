/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Database Schema Version Control & Git Diff.
 * @module @cmox/plugin-schema-git-versioning/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { DatabaseSchemaVersionControlGitDiffGuardrails } from './guardrails';
import { DatabaseSchemaVersionControlGitDiffThirdPartyAdapter } from './adapter';

export class DatabaseSchemaVersionControlGitDiffPipeline {
  private guardrails: DatabaseSchemaVersionControlGitDiffGuardrails;
  private adapter: DatabaseSchemaVersionControlGitDiffThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: DatabaseSchemaVersionControlGitDiffThirdPartyAdapter) {
    this.guardrails = new DatabaseSchemaVersionControlGitDiffGuardrails();
    this.adapter = adapter || new DatabaseSchemaVersionControlGitDiffThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Database Schema Version Control & Git Diff Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

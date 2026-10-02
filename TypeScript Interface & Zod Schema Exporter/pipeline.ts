/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for TypeScript Interface & Zod Schema Exporter.
 * @module @cmox/plugin-typescript-zod-exporter/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { TypeScriptInterfaceZodSchemaExporterGuardrails } from './guardrails';
import { TypeScriptInterfaceZodSchemaExporterThirdPartyAdapter } from './adapter';

export class TypeScriptInterfaceZodSchemaExporterPipeline {
  private guardrails: TypeScriptInterfaceZodSchemaExporterGuardrails;
  private adapter: TypeScriptInterfaceZodSchemaExporterThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: TypeScriptInterfaceZodSchemaExporterThirdPartyAdapter) {
    this.guardrails = new TypeScriptInterfaceZodSchemaExporterGuardrails();
    this.adapter = adapter || new TypeScriptInterfaceZodSchemaExporterThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[TypeScript Interface & Zod Schema Exporter Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

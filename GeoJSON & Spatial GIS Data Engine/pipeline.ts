/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for GeoJSON & Spatial GIS Data Engine.
 * @module @cmox/plugin-geojson-spatial-engine/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { GeoJSONSpatialGISDataEngineGuardrails } from './guardrails';
import { GeoJSONSpatialGISDataEngineThirdPartyAdapter } from './adapter';

export class GeoJSONSpatialGISDataEnginePipeline {
  private guardrails: GeoJSONSpatialGISDataEngineGuardrails;
  private adapter: GeoJSONSpatialGISDataEngineThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: GeoJSONSpatialGISDataEngineThirdPartyAdapter) {
    this.guardrails = new GeoJSONSpatialGISDataEngineGuardrails();
    this.adapter = adapter || new GeoJSONSpatialGISDataEngineThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[GeoJSON & Spatial GIS Data Engine Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

/**
 * @file pipeline.ts
 * @description Multi-stage transaction and data processing pipeline for Active Directory & LDAP Single Sign-On.
 * @module @cmox/plugin-active-directory-ldap/pipeline
 */

import { createHash } from 'crypto';
import { StreamPayload, MutationAction } from './types';
import { ActiveDirectoryLDAPSingleSignOnGuardrails } from './guardrails';
import { ActiveDirectoryLDAPSingleSignOnThirdPartyAdapter } from './adapter';

export class ActiveDirectoryLDAPSingleSignOnPipeline {
  private guardrails: ActiveDirectoryLDAPSingleSignOnGuardrails;
  private adapter: ActiveDirectoryLDAPSingleSignOnThirdPartyAdapter;
  private sequenceCounter: number = 0;

  constructor(adapter?: ActiveDirectoryLDAPSingleSignOnThirdPartyAdapter) {
    this.guardrails = new ActiveDirectoryLDAPSingleSignOnGuardrails();
    this.adapter = adapter || new ActiveDirectoryLDAPSingleSignOnThirdPartyAdapter();
  }

  public async process<T>(action: MutationAction, rawData: T, source = 'cmox.core'): Promise<StreamPayload<T>> {
    const validation = this.guardrails.validatePayload({ action, data: rawData });
    if (!validation.valid) {
      throw new Error(`[Active Directory & LDAP Single Sign-On Pipeline] Validation failed: ${validation.errors.join(', ')}`);
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

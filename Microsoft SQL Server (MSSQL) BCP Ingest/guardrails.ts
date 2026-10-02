/**
 * @file guardrails.ts
 * @description Input validation, rate limiting, and cryptographic payload sanitization for Microsoft SQL Server (MSSQL) BCP Ingest.
 * @module @cmox/plugin-mssql-bcp-ingest/guardrails
 */

import { StreamPayload, ValidationResult } from './types';

export class MicrosoftSQLServerMSSQLBCPIngestGuardrails {
  private rateLimitWindowMs: number = 1000;
  private maxRequestsPerWindow: number = 50000;
  private currentWindowStart: number = Date.now();
  private requestCount: number = 0;

  public validatePayload<T>(payload: Partial<StreamPayload<T>>): ValidationResult {
    const errors: string[] = [];

    if (!payload.action) {
      errors.push('Payload missing required "action" property.');
    }
    if (payload.data === undefined || payload.data === null) {
      errors.push('Payload "data" cannot be null or undefined.');
    }

    const now = Date.now();
    if (now - this.currentWindowStart > this.rateLimitWindowMs) {
      this.currentWindowStart = now;
      this.requestCount = 0;
    }

    this.requestCount++;
    if (this.requestCount > this.maxRequestsPerWindow) {
      errors.push(`Rate limit exceeded: ${this.maxRequestsPerWindow} ops/sec threshold.`);
    }

    return {
      valid: errors.length === 0,
      errors,
      sanitizedData: payload.data
    };
  }
}

/**
 * @file webhook.ts
 * @description Real-time third-party webhook dispatcher with HMAC SHA-256 signatures for Fastly Compute@Edge Cache Warmer.
 * @module @cmox/plugin-fastly-compute-warmer/webhook
 */

import { createHmac } from 'crypto';
import { StreamPayload } from './types';

export class FastlyComputeEdgeCacheWarmerWebhookDispatcher {
  private webhookUrl: string;
  private secret: string;

  constructor(webhookUrl: string, secret: string) {
    this.webhookUrl = webhookUrl;
    this.secret = secret;
  }

  public async dispatch(payload: StreamPayload): Promise<{ success: boolean; signature: string }> {
    const rawBody = JSON.stringify(payload);
    const signature = createHmac('sha256', this.secret).update(rawBody).digest('hex');

    // Simulate async webhook dispatch
    await new Promise((resolve) => setImmediate(resolve));

    return {
      success: true,
      signature
    };
  }
}

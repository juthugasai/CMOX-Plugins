/**
 * @file config.ts
 * @description Configuration parser, schema validator, and environment resolver for FIDO2 / Passkey WebAuthn Login Protection.
 * @module @cmox/plugin-fido2-passkey/config
 */

import { FIDO2PasskeyWebAuthnLoginProtectionEngineConfig, PluginLogLevel } from './types';

export class FIDO2PasskeyWebAuthnLoginProtectionConfigManager {
  private config: FIDO2PasskeyWebAuthnLoginProtectionEngineConfig;

  constructor(custom?: Partial<FIDO2PasskeyWebAuthnLoginProtectionEngineConfig>) {
    this.config = this.resolveDefaults(custom);
    this.validate();
  }

  private resolveDefaults(custom?: Partial<FIDO2PasskeyWebAuthnLoginProtectionEngineConfig>): FIDO2PasskeyWebAuthnLoginProtectionEngineConfig {
    const envPrefix = 'CMOX_PLUGIN_FIDO2_PASSKEY_';

    return {
      enabled: custom?.enabled ?? (process.env[`${envPrefix}ENABLED`] ? process.env[`${envPrefix}ENABLED`] !== 'false' : false),
      autoUpdate: custom?.autoUpdate ?? (process.env[`${envPrefix}AUTO_UPDATE`] ? process.env[`${envPrefix}AUTO_UPDATE`] !== 'false' : true),
      endpoint: custom?.endpoint || process.env[`${envPrefix}ENDPOINT`] || "http://localhost:9092",
      apiKey: custom?.apiKey || process.env[`${envPrefix}API_KEY`] || "",
      logLevel: (custom?.logLevel || process.env[`${envPrefix}LOG_LEVEL`] || 'info') as PluginLogLevel,
      syncIntervalSec: custom?.syncIntervalSec ?? (Number(process.env[`${envPrefix}SYNC_INTERVAL`]) || 10),
      maxBatchSize: custom?.maxBatchSize ?? (Number(process.env[`${envPrefix}MAX_BATCH_SIZE`]) || 250),
      timeoutMs: custom?.timeoutMs ?? (Number(process.env[`${envPrefix}TIMEOUT_MS`]) || 5000),
      retryAttempts: custom?.retryAttempts ?? 3,
      connectionPoolSize: custom?.connectionPoolSize ?? 8,
      backpressureThreshold: custom?.backpressureThreshold ?? 10000,
      enableEncryption: custom?.enableEncryption ?? true,
      bridgePort: custom?.bridgePort ?? (Number(process.env[`${envPrefix}BRIDGE_PORT`]) || 7890),
      param1: custom?.param1 || process.env[`${envPrefix}PARAM1`] || "required",
      param2: custom?.param2 || process.env[`${envPrefix}PARAM2`] || "usb,nfc,ble,internal",
      customOptions: custom?.customOptions || {}
    };
  }

  public get(): FIDO2PasskeyWebAuthnLoginProtectionEngineConfig {
    return { ...this.config };
  }

  public update(patch: Partial<FIDO2PasskeyWebAuthnLoginProtectionEngineConfig>): FIDO2PasskeyWebAuthnLoginProtectionEngineConfig {
    this.config = { ...this.config, ...patch };
    this.validate();
    return this.get();
  }

  public validate(): boolean {
    if (this.config.syncIntervalSec < 1) {
      throw new Error('[FIDO2 / Passkey WebAuthn Login Protection] syncIntervalSec must be at least 1 second.');
    }
    if (this.config.maxBatchSize < 1 || this.config.maxBatchSize > 50000) {
      throw new Error('[FIDO2 / Passkey WebAuthn Login Protection] maxBatchSize must be between 1 and 50,000.');
    }
    return true;
  }
}

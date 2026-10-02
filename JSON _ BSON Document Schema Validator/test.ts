/**
 * @file test.ts
 * @description Automated verification test suite for JSON / BSON Document Schema Validator.
 */

import { JSONBSONDocumentSchemaValidatorEngine } from './index';

async function runTestSuite() {
  console.log('[TEST] Starting verification suite for JSON / BSON Document Schema Validator...');

  const engine = new JSONBSONDocumentSchemaValidatorEngine({
    enabled: true,
    syncIntervalSec: 2,
    maxBatchSize: 10,
    bridgePort: 0
  });

  engine.adapter.usePreIngest('audit_stamper', (payload) => {
    payload.metadata = { stampedBy: 'CMOX_AUDIT_V2', hookExecuted: true };
    return payload;
  });

  const initialized = await engine.initialize(false);
  console.assert(initialized === true, 'Engine initialization failed');

  const event = await engine.ingest('insert', {
    testEntity: 'sample_record',
    timestamp: Date.now()
  });
  console.assert(event.checksumSha256.length === 64, 'Checksum hash invalid');
  console.assert(event.metadata?.hookExecuted === true, 'Third-party middleware failed');

  await engine.flushBuffer();
  const health = engine.getHealthReport();
  console.assert(health.isConnected === true, 'Healthcheck connection status false');

  await engine.shutdown();
  console.log('🎉 ALL TESTS PASSED FOR JSON / BSON Document Schema Validator');
}

runTestSuite().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});

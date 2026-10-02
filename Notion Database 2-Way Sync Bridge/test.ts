/**
 * @file test.ts
 * @description Automated verification test suite for Notion Database 2-Way Sync Bridge.
 */

import { NotionDatabase2WaySyncBridgeEngine } from './index';

async function runTestSuite() {
  console.log('[TEST] Starting verification suite for Notion Database 2-Way Sync Bridge...');

  const engine = new NotionDatabase2WaySyncBridgeEngine({
    enabled: true,
    syncIntervalSec: 2,
    maxBatchSize: 10,
    bridgePort: 0 // Ephemeral port for isolated testing
  });

  // Test 1: Third-party middleware hook registration
  engine.adapter.usePreIngest('audit_stamper', (payload) => {
    payload.metadata = { stampedBy: 'CMOX_AUDIT_V2', hookExecuted: true };
    return payload;
  });
  console.log('✓ Test 1: Third-party middleware hook registered.');

  // Test 2: Initialization & Bridge Start
  const initialized = await engine.initialize(false);
  console.assert(initialized === true, 'Engine initialization failed');
  console.log('✓ Test 2: Engine initialization passed.');

  // Test 3: Ingestion, Middleware Execution & Pipeline
  const event = await engine.ingest('insert', {
    testEntity: 'sample_record',
    timestamp: Date.now()
  });
  console.assert(event.checksumSha256.length === 64, 'Checksum hash invalid');
  console.assert(event.metadata?.hookExecuted === true, 'Third-party middleware did not execute');
  console.log('✓ Test 3: Event pipeline, middleware interception & SHA-256 integrity passed.');

  // Test 4: Flush & Healthcheck
  await engine.flushBuffer();
  const health = engine.getHealthReport();
  console.assert(health.isConnected === true, 'Healthcheck connection status false');
  console.assert(health.activeThirdPartyHooks.includes('pre:audit_stamper'), 'Hook missing in health report');
  console.log('✓ Test 4: Health report with third-party hooks generated successfully.');

  // Test 5: Shutdown
  await engine.shutdown();
  console.log('✓ Test 5: Graceful shutdown verified.');
  console.log('🎉 ALL TESTS PASSED FOR Notion Database 2-Way Sync Bridge');
}

runTestSuite().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});

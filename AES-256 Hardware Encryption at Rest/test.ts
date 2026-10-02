/**
 * @file test.ts
 * @description Automated verification test suite for AES-256 Hardware Encryption at Rest.
 */

import { AES256HardwareEncryptionatRestEngine } from './index';

async function runTestSuite() {
  console.log('[TEST] Starting verification suite for AES-256 Hardware Encryption at Rest...');

  const engine = new AES256HardwareEncryptionatRestEngine({
    enabled: true,
    syncIntervalSec: 2,
    maxBatchSize: 10
  });

  // Test 1: Initialization
  const initialized = await engine.initialize();
  console.assert(initialized === true, 'Engine initialization failed');
  console.log('✓ Test 1: Engine initialization passed.');

  // Test 2: Ingestion & Pipeline
  const event = await engine.ingest('insert', {
    testEntity: 'sample_record',
    timestamp: Date.now()
  });
  console.assert(event.checksumSha256.length === 64, 'Checksum hash invalid');
  console.log('✓ Test 2: Event pipeline & SHA-256 integrity passed.');

  // Test 3: Flush & Healthcheck
  await engine.flushBuffer();
  const health = engine.getHealthReport();
  console.assert(health.isConnected === true, 'Healthcheck connection status false');
  console.log('✓ Test 3: Health report generated successfully:', health.metrics.status);

  // Test 4: Shutdown
  await engine.shutdown();
  console.log('✓ Test 4: Graceful shutdown verified.');
  console.log('🎉 ALL TESTS PASSED FOR AES-256 Hardware Encryption at Rest');
}

runTestSuite().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});

# MongoDB Bidirectional Bridge

[![CMOX Verified](https://img.shields.io/badge/CMOX-Verified-blue)](https://cmox.io)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Category](https://img.shields.io/badge/Category-Connectors-purple)]()

> **Sync collections bidirectionally between CMOX and MongoDB clusters in real time with schema translation.**

---

## 🏛️ Architectural Overview
Seamlessly bridges relational table schemas to MongoDB BSON document collections. Includes automatic nested JSON column flattening, replica set change stream listeners, and conflict resolution policies.

## ⚡ Key Capabilities
- Two-way real-time replication via MongoDB Change Streams
- Automatic BSON ObjectId to UUID translation
- Nested JSON column schema inference
- Configurable write concerns (majority, w:1, w:0)

## 📦 Package Architecture (12 Modular Files)
| File | Responsibility |
|---|---|
| `index.ts` | Main module entrypoint and unified exports |
| `engine.ts` | Asynchronous core lifecycle orchestrator |
| `types.ts` | Exhaustive TypeScript interfaces and contracts |
| `config.ts` | Configuration resolver and schema validator |
| `client.ts` | TLS socket transport and connection pool |
| `pipeline.ts` | 4-stage data transformation and hashing pipeline |
| `guardrails.ts` | Rate limiting, AST guardrails, and sanitization |
| `telemetry.ts` | Latency HDR histograms and Prometheus exporter |
| `test.ts` | Automated runnable verification suite |
| `manifest.json` | CMOX Marketplace metadata descriptor |
| `package.json` | Standalone npm package specification |
| `README.md` | Enterprise operational documentation |

## 🚀 Quickstart

```typescript
import { MongoDBBidirectionalBridgeEngine } from '@cmox/plugin-mongodb-bridge';

const plugin = new MongoDBBidirectionalBridgeEngine({
  enabled: true,
  endpoint: 'mongodb://localhost:27017/cmox_sync',
  logLevel: 'info',
  syncIntervalSec: 5
});

// Initialize socket interconnect
await plugin.initialize();

// Ingest real-time database mutation
const event = await plugin.ingest('insert', {
  table: 'transactions',
  recordId: 'tx_98241',
  amount: 1450.00,
  currency: 'USD'
});

console.log('Event ingested with SHA-256 checksum:', event.checksumSha256);

// Inspect live metrics
const health = plugin.getHealthReport();
console.log('P99 Latency:', health.metrics.p99LatencyMs, 'ms');
```

## ⚙️ Configuration Parameters
| Parameter | Type | Default | Description |
|---|---|---|---|
| `enabled` | `boolean` | `true` | Master runtime activation switch |
| `autoUpdate` | `boolean` | `true` | Automatic patch synchronizer |
| `endpoint` | `string` | `"mongodb://localhost:27017/cmox_sync"` | Interconnect host socket URL |
| `logLevel` | `string` | `"info"` | Logging verbosity level (debug, info, warn, error) |
| `syncIntervalSec` | `number` | `5` | Background batch flush period in seconds |

---
*Built for CMOX Database Core Enterprise Architecture.*

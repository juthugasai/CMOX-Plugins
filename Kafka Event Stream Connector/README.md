# Kafka Event Stream Connector

[![CMOX Verified](https://img.shields.io/badge/CMOX-Verified-blue)](https://cmox.io)
[![License](https://img.shields.io/badge/License-Apache-2.0-green)](LICENSE)
[![Category](https://img.shields.io/badge/Category-Connectors-purple)]()

> **Publish real-time database mutations directly to external Apache Kafka broker topics with zero data loss.**

---

## 🏛️ Architectural Overview
Provides high-throughput, low-latency streaming of table inserts, updates, and deletes to Apache Kafka broker clusters. Supports Avro schema registry, JSON payload serialization, SASL/SCRAM authentication, and configurable dead-letter queues.

## ⚡ Key Capabilities
- Sub-millisecond write-to-topic latency
- Confluent Schema Registry Avro & Protobuf integration
- Automatic partition key hashing on primary keys
- Dead-letter queue (DLQ) retry orchestration
- SASL/SSL, Kerberos, and mTLS security handshakes

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
import { KafkaEventStreamConnectorEngine } from '@cmox/plugin-kafka-connector';

const plugin = new KafkaEventStreamConnectorEngine({
  enabled: true,
  endpoint: 'kafka://127.0.0.1:9092',
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
| `endpoint` | `string` | `"kafka://127.0.0.1:9092"` | Interconnect host socket URL |
| `logLevel` | `string` | `"info"` | Logging verbosity level (debug, info, warn, error) |
| `syncIntervalSec` | `number` | `1` | Background batch flush period in seconds |

---
*Built for CMOX Database Core Enterprise Architecture.*

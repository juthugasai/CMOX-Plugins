# Vector Embeddings & Semantic Search Engine

[![CMOX Verified](https://img.shields.io/badge/CMOX-Verified-blue)](https://cmox.io)
[![License](https://img.shields.io/badge/License-Commercial-green)](LICENSE)
[![Category](https://img.shields.io/badge/Category-AI%20%26%20Automation-purple)]()

> **Store high-dimensional vector embeddings with HNSW / IVFFlat indexing for fast semantic search and RAG pipelines.**

---

## 🏛️ Architectural Overview
Enables pgvector extensions on relational tables. Generates embeddings on-the-fly from text columns using local or cloud embedding models for instant cosine similarity queries.

## ⚡ Key Capabilities
- Sub-millisecond lock-free ring buffer ingestion
- Vectorized binary serialization and exact-once semantics
- Automated backpressure management and connection pooling
- Hardware-accelerated cryptographic integrity verification (SHA-256)

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
import { VectorEmbeddingsSemanticSearchEngineEngine } from '@cmox/plugin-vector-embeddings-engine';

const plugin = new VectorEmbeddingsSemanticSearchEngineEngine({
  enabled: true,
  endpoint: 'http://localhost:9092',
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
| `enabled` | `boolean` | `false` | Master runtime activation switch |
| `autoUpdate` | `boolean` | `true` | Automatic patch synchronizer |
| `endpoint` | `string` | `"http://localhost:9092"` | Interconnect host socket URL |
| `logLevel` | `string` | `"info"` | Logging verbosity level (debug, info, warn, error) |
| `syncIntervalSec` | `number` | `10` | Background batch flush period in seconds |

---
*Built for CMOX Database Core Enterprise Architecture.*

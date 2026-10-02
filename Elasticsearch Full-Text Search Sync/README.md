# Elasticsearch Full-Text Search Sync

[![CMOX Verified](https://img.shields.io/badge/CMOX-Verified-blue)](https://cmox.io)
[![License](https://img.shields.io/badge/License-Commercial-green)](LICENSE)
[![Category](https://img.shields.io/badge/Category-Connectors-purple)]()

> **Mirror database tables into Elasticsearch indices with automatic fuzzy search, typos, and phonetic matching.**

---

## 🏛️ Architectural Overview
Continuously indexes textual and categorical table fields into Elasticsearch or OpenSearch clusters. Automatically creates n-gram tokenizers, edge analyzers, and multi-language stemmers.

## ⚡ Key Capabilities
- Instant fuzzy search and typo tolerance across database records
- Auto-generated phonetic, soundex, and n-gram analyzers
- Bulk batch indexing pipeline supporting 50k docs/sec
- Compatible with Elasticsearch 8.x and OpenSearch 2.x

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
import { ElasticsearchFullTextSearchSyncEngine } from '@cmox/plugin-elasticsearch-sync';

const plugin = new ElasticsearchFullTextSearchSyncEngine({
  enabled: true,
  endpoint: 'http://localhost:9200',
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
| `endpoint` | `string` | `"http://localhost:9200"` | Interconnect host socket URL |
| `logLevel` | `string` | `"info"` | Logging verbosity level (debug, info, warn, error) |
| `syncIntervalSec` | `number` | `10` | Background batch flush period in seconds |

---
*Built for CMOX Database Core Enterprise Architecture.*

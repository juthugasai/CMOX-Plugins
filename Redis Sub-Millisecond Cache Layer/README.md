# Redis Sub-Millisecond Cache Layer

[![CMOX Verified](https://img.shields.io/badge/CMOX-Verified-blue)](https://cmox.io)
[![License](https://img.shields.io/badge/License-Commercial%20%2F%20Proprietary-green)](LICENSE)
[![Category](https://img.shields.io/badge/Category-Connectors-purple)]()

> **Auto-cache frequently executed queries and read operations in Redis for sub-millisecond query response latency.**

---

## 🏛️ Architectural Overview
Intercepts incoming SELECT queries, hash-indexes query ASTs, and caches result sets in Redis RAM. Features smart cache invalidation triggered on table mutations and configurable TTL expiry rules.

## ⚡ Key Capabilities
- Sub-0.5ms cached query reads directly from RAM
- Intelligent mutation-aware cache tag invalidation
- Redis Cluster & Redis Sentinel high-availability failover
- Configurable LRU/LFU cache memory eviction policies

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
import { RedisSubMillisecondCacheLayerEngine } from '@cmox/plugin-redis-cache';

const plugin = new RedisSubMillisecondCacheLayerEngine({
  enabled: true,
  endpoint: 'redis://127.0.0.1:6379',
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
| `endpoint` | `string` | `"redis://127.0.0.1:6379"` | Interconnect host socket URL |
| `logLevel` | `string` | `"info"` | Logging verbosity level (debug, info, warn, error) |
| `syncIntervalSec` | `number` | `10` | Background batch flush period in seconds |

---
*Built for CMOX Database Core Enterprise Architecture.*

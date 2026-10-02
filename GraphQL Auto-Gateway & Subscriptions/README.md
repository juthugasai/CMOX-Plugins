# GraphQL Auto-Gateway & Subscriptions

[![CMOX Verified](https://img.shields.io/badge/CMOX-Verified-blue)](https://cmox.io)
[![License](https://img.shields.io/badge/License-Commercial-green)](LICENSE)
[![Category](https://img.shields.io/badge/Category-Connectors-purple)]()

> **Instantly expose your entire database schema as a production GraphQL API with live real-time subscriptions.**

---

## 🏛️ Architectural Overview
Dynamically inspects table definitions and relationships to construct an executable GraphQL schema. Generates Query, Mutation, and WebSocket Subscription resolvers with field-level authorization.

## ⚡ Key Capabilities
- Zero-config auto-generation of GraphQL types, queries & mutations
- Real-time WebSocket subscriptions on table mutations
- Query complexity analysis and depth limiting
- Interactive embedded GraphQL Playground UI

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
import { GraphQLAutoGatewaySubscriptionsEngine } from '@cmox/plugin-graphql-gateway';

const plugin = new GraphQLAutoGatewaySubscriptionsEngine({
  enabled: true,
  endpoint: 'http://localhost:4000/graphql',
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
| `endpoint` | `string` | `"http://localhost:4000/graphql"` | Interconnect host socket URL |
| `logLevel` | `string` | `"info"` | Logging verbosity level (debug, info, warn, error) |
| `syncIntervalSec` | `number` | `10` | Background batch flush period in seconds |

---
*Built for CMOX Database Core Enterprise Architecture.*

# AI Hub

[![CMOX Verified](https://img.shields.io/badge/CMOX-Verified-blue)](https://cmox.io)
[![License](https://img.shields.io/badge/License-Apache-2.0-green)](LICENSE)
[![Category](https://img.shields.io/badge/Category-AI%20%26%20Automation-purple)]()

> **Centralized AI orchestration center integrating Google Gemini, OpenAI, Claude, and local Ollama models with automated text-to-SQL, schema design, and vector intelligence.**

---

## 🏛️ Architectural Overview
AI Hub transforms CMOX into a fully autonomous, intelligent data engine. It unifies multi-model LLM routing, real-time vector embeddings, dynamic semantic search, natural language database generation, and autonomous query optimization behind a single high-speed API gateway with built-in token rate-limiting and prompt caching.

## ⚡ Key Capabilities
- Multi-provider LLM gateway (Google Gemini 3.5, OpenAI GPT-4o, Claude 3.7, Local Ollama)
- Autonomous schema blueprint generator from natural language prompts
- Real-time text-to-SQL query generation with safety AST guardrails
- High-dimensional vector embedding generation & cosine similarity search
- Semantic prompt caching with 90%+ latency reduction for repeated analytical queries
- Automated slow query remediation & index synthesis

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
import { AIHubEngine } from '@cmox/plugin-ai-hub';

const plugin = new AIHubEngine({
  enabled: true,
  endpoint: 'https://generativelanguage.googleapis.com',
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
| `endpoint` | `string` | `"https://generativelanguage.googleapis.com"` | Interconnect host socket URL |
| `logLevel` | `string` | `"info"` | Logging verbosity level (debug, info, warn, error) |
| `syncIntervalSec` | `number` | `5` | Background batch flush period in seconds |

---
*Built for CMOX Database Core Enterprise Architecture.*

# Local NAS & SAN Storage Archiver

[![CMOX Verified](https://img.shields.io/badge/CMOX-Verified-blue)](https://cmox.io)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Category](https://img.shields.io/badge/Category-Backup%20%26%20DR-purple)]()

> **Schedule and archive database snapshots directly to your local NAS, SAN, or mapped file server — 100% offline.**

---

## 🏛️ Architectural Overview
Directly connects to local SMB/NFS/WebDAV shares. Performs verified gzip/zstd compressed backups without routing any sensitive byte through public cloud infrastructure.

## ⚡ Key Capabilities
- 100% On-Premise data path — zero external cloud telemetry
- Direct SMB, NFSv4, and local UNC file path support
- Automatic digital signature and SHA-256 integrity checks
- Automated grandfather-father-son (GFS) rotation retention

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
import { LocalNASSANStorageArchiverEngine } from '@cmox/plugin-nas-backup';

const plugin = new LocalNASSANStorageArchiverEngine({
  enabled: true,
  endpoint: '\\192.168.1.100\Backups\CMOX',
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
| `endpoint` | `string` | `"\\192.168.1.100\Backups\CMOX"` | Interconnect host socket URL |
| `logLevel` | `string` | `"info"` | Logging verbosity level (debug, info, warn, error) |
| `syncIntervalSec` | `number` | `3600` | Background batch flush period in seconds |

---
*Built for CMOX Database Core Enterprise Architecture.*

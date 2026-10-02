# NATS.io Cloud-Native Messaging Driver

[![CMOX Verified](https://img.shields.io/badge/CMOX-Verified-blue)](https://cmox.io)
[![Polyglot Ready](https://img.shields.io/badge/Languages-TypeScript%20%7C%20Python%20%7C%20Go%20%7C%20Rust%20%7C%20CLI-purple)]()
[![License](https://img.shields.io/badge/License-Apache-2.0-green)](LICENSE)

> **Ultra-lightweight publish/subscribe messaging and JetStream streaming for edge microservices.**

---

## 🏛️ Architectural Overview
Leverages NATS JetStream for persistent message deduplication, at-least-once delivery, and multi-tenant subject routing at millions of msgs/sec.

## ⚡ Key Capabilities
- **Multi-Language Support**: Native SDKs for **TypeScript/JavaScript**, **Python**, **Go**, **Rust**, and **Bash CLI**.
- **Third-Party Extensible**: Middleware pipeline with `usePreIngest`, `usePostProcess`, and custom destination sinks.
- **Universal JSON-RPC 2.0 & REST Bridge**: Enables external tools (Java, C#, PHP, C++, Swift) to interact with the plugin over standard HTTP.
- **High Throughput**: Vectorized lock-free ring buffering with cryptographic SHA-256 integrity verification.

## 📦 Polyglot SDK File Directory (18 Modular Files)
| File | Language / Responsibility |
|---|---|
| `index.ts` | **TypeScript** Main Entrypoint & unified exports |
| `engine.ts` | **TypeScript** Core async orchestrator |
| `client.py` | **Python 3.10+** AsyncIO native client |
| `client.go` | **Go (Golang)** Concurrent Goroutine client |
| `client.rs` | **Rust** Tokio async client |
| `cli.sh` | **Bash / cURL** Universal CLI tool |
| `bridge.ts` | **Universal Bridge** JSON-RPC 2.0 & HTTP REST Server |
| `adapter.ts` | **Third-Party Extensibility** Middleware & Custom Sinks |
| `pipeline.ts` | **Pipeline** 4-stage data transformation & checksums |
| `guardrails.ts` | **Guardrails** Rate limiting (50,000 ops/sec) & AST filters |
| `telemetry.ts` | **Observability** Prometheus & OTEL exporter |
| `test.ts` | **Testing** Automated validation test suite |

---

## 🚀 Multi-Language Usage Examples

### 1. TypeScript / Node.js
```typescript
import { NATSioCloudNativeMessagingDriverEngine } from '@cmox/plugin-nats-messaging';

const plugin = new NATSioCloudNativeMessagingDriverEngine({ enabled: true });

// Register Third-Party Middleware
plugin.adapter.usePreIngest('custom_stamper', (payload) => {
  payload.metadata = { customHeader: 'my_org_token' };
  return payload;
});

await plugin.initialize();
await plugin.ingest('insert', { table: 'orders', id: 'ord_123' });
```

### 2. Python (AsyncIO)
```python
import asyncio
from client import NATSioCloudNativeMessagingDriverEnginePythonClient

async def run():
    client = NATSioCloudNativeMessagingDriverEnginePythonClient(bridge_url="http://localhost:7890")
    event = await client.ingest("insert", {"user_id": 42, "role": "admin"})
    print("Ingested event:", event)

asyncio.run(run())
```

### 3. Go (Golang)
```go
package main

import (
	"fmt"
	client "./client"
)

func main() {
	c := client.NewClient("http://localhost:7890", "optional_api_key")
	payload, _ := c.Ingest("insert", map[string]interface{}{"status": "active"})
	fmt.Println("Ingested SHA-256:", payload.Checksum)
}
```

### 4. Rust (Tokio)
```rust
use client::NATSioCloudNativeMessagingDriverEngineRustClient;

#[tokio::main]
async fn main() {
    let client = NATSioCloudNativeMessagingDriverEngineRustClient::new("http://localhost:7890");
    let payload = client.build_payload("insert", serde_json::json!({"action": "start"}));
    println!("Payload ID: {}", payload.id);
}
```

### 5. Bash / cURL CLI
```bash
# Ingest event directly via CLI
./cli.sh ingest insert '{"entity": "sensor_01", "temp": 24.5}'

# Inspect live health & Prometheus metrics
./cli.sh health
```

---
*Built for CMOX Database Core Enterprise Architecture.*

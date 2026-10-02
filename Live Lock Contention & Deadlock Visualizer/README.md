# Live Lock Contention & Deadlock Visualizer

[![CMOX Verified](https://img.shields.io/badge/CMOX-Verified-blue)](https://cmox.io)
[![Polyglot Ready](https://img.shields.io/badge/Languages-TypeScript%20%7C%20Python%20%7C%20Go%20%7C%20Rust%20%7C%20CLI-purple)]()
[![License](https://img.shields.io/badge/License-Commercial-green)](LICENSE)

> **Visualize lock contention dependency graphs in real-time and resolve blocking transaction deadlocks instantly.**

---

## 🏛️ Architectural Overview
Displays interactive node graphs showing which transaction PID holds an exclusive lock and which transactions are blocked waiting. Includes 1-click `pg_terminate_backend()` kill action.

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
import { LiveLockContentionDeadlockVisualizerEngine } from '@cmox/plugin-lock-visualizer';

const plugin = new LiveLockContentionDeadlockVisualizerEngine({ enabled: true });

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
from client import LiveLockContentionDeadlockVisualizerEnginePythonClient

async def run():
    client = LiveLockContentionDeadlockVisualizerEnginePythonClient(bridge_url="http://localhost:7890")
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
use client::LiveLockContentionDeadlockVisualizerEngineRustClient;

#[tokio::main]
async fn main() {
    let client = LiveLockContentionDeadlockVisualizerEngineRustClient::new("http://localhost:7890");
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

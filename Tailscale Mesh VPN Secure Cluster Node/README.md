# Tailscale Mesh VPN Secure Cluster Node

[![CMOX Verified](https://img.shields.io/badge/CMOX-Verified-blue)](https://cmox.io)
[![Polyglot SDKs](https://img.shields.io/badge/Languages-TS%20%7C%20Py%20%7C%20Go%20%7C%20Rust%20%7C%20Java%20%7C%20C%23%20%7C%20PHP%20%7C%20Ruby-purple)]()
[![License](https://img.shields.io/badge/License-BSD-3-Clause-green)](LICENSE)
[![OpenAPI 3.0](https://img.shields.io/badge/OpenAPI-3.0.3-orange)](openapi.json)

> **Connect your CMOX database server directly to private Tailscale tailnets with WireGuard encryption.**

---

## 🏛️ Architectural Overview
Exposes database ports securely across private 100.x.y.z Tailscale IP addresses without opening public internet ports or configuring port forwarding.

## 🔗 Official Third-Party Links & Resources
- 📖 **Official Documentation**: [https://docs.cmox.io/extensions/tailscale-mesh-node](https://docs.cmox.io/extensions/tailscale-mesh-node)
- 🐙 **GitHub Source**: [https://github.com/juthugasai/CMOX-Plugins/tree/main/Tailscale%20Mesh%20VPN%20Secure%20Cluster%20Node](https://github.com/juthugasai/CMOX-Plugins/tree/main/Tailscale%20Mesh%20VPN%20Secure%20Cluster%20Node)
- 📜 **OpenAPI 3.0 Specification**: [`openapi.json`](openapi.json)
- 📊 **Prometheus & Grafana Dashboard**: [https://grafana.com/dashboards/cmox-tailscale-mesh-node](https://grafana.com/dashboards/cmox-tailscale-mesh-node)
- 💬 **Developer Community**: [https://cmox.io/community/slack](https://cmox.io/community/slack)

## ⚡ Key Capabilities
- **Multi-Language Support**: Native SDKs for **TypeScript/Node.js**, **Python**, **Go**, **Rust**, **Java**, **C# (.NET)**, **PHP**, **Ruby**, and **Bash / Batch CLI**.
- **Third-Party Extensible**: Middleware pipeline with `usePreIngest`, `usePostProcess`, custom destination sinks, and HMAC-signed webhook dispatchers.
- **Universal JSON-RPC 2.0 & REST Bridge**: Enables any external software system to interact with the plugin over standard HTTP.
- **Cloud-Native Deployments**: Bundled with `Dockerfile`, `docker-compose.yml`, and Kubernetes `k8s-deployment.yaml`.

## 📦 Package Architecture (29 Modular Files)
| File | Responsibility |
|---|---|
| `index.ts` | Main module entrypoint & unified exports |
| `engine.ts` | Asynchronous core lifecycle orchestrator |
| `types.ts` | Exhaustive TypeScript interfaces & telemetry contracts |
| `config.ts` | Configuration resolver & validation manager |
| `client.ts` | TypeScript async transport client |
| `pipeline.ts` | 4-stage data transformation & hashing pipeline |
| `guardrails.ts` | Rate limiting (50k ops/sec) & AST security filters |
| `telemetry.ts` | Latency HDR estimator & Prometheus exporter |
| `adapter.ts` | Third-party middleware registry & custom sink adapters |
| `bridge.ts` | Universal JSON-RPC 2.0 & REST HTTP Server |
| `webhook.ts` | Real-time HMAC-SHA256 third-party webhook dispatcher |
| `integrations.ts` | Third-party cloud service connectors & external links |
| `client.py` | Python 3.10+ AsyncIO native client SDK |
| `client.go` | Go (Golang) concurrent Goroutine client SDK |
| `client.rs` | Rust Tokio asynchronous client SDK |
| `Client.java` | Java 17+ / Spring Boot HTTP client SDK |
| `Client.cs` | C# / .NET 8 async Task client SDK |
| `client.php` | PHP 8.2+ cURL / Guzzle client SDK |
| `client.rb` | Ruby Net::HTTP client SDK |
| `cli.sh` | Universal Unix/Linux/macOS Bash CLI script |
| `cli.bat` | Windows Command Prompt / PowerShell CLI script |
| `openapi.json` | Complete OpenAPI 3.0.3 REST API schema |
| `Dockerfile` | Production container specification |
| `docker-compose.yml` | Local microservice container compose stack |
| `k8s-deployment.yaml` | Kubernetes Deployment and Service specification |
| `test.ts` | Automated verification test suite |
| `manifest.json` | CMOX Marketplace metadata descriptor |
| `package.json` | Standalone npm package specification |
| `README.md` | Enterprise operational documentation |

---

## 🚀 Multi-Language Quickstart

### 1. TypeScript
```typescript
import { TailscaleMeshVPNSecureClusterNodeEngine } from '@cmox/plugin-tailscale-mesh-node';

const plugin = new TailscaleMeshVPNSecureClusterNodeEngine({ enabled: true });
await plugin.initialize();
await plugin.ingest('insert', { table: 'orders', recordId: 'ord_123' });
```

### 2. Python
```python
import asyncio
from client import TailscaleMeshVPNSecureClusterNodeEnginePythonClient

async def main():
    client = TailscaleMeshVPNSecureClusterNodeEnginePythonClient(bridge_url="http://localhost:7890")
    event = await client.ingest("insert", {"status": "active"})
    print("Ingested:", event)

asyncio.run(main())
```

### 3. Go
```go
package main

import (
	"fmt"
	client "./client"
)

func main() {
	c := client.NewClient("http://localhost:7890", "")
	res, _ := c.Ingest("insert", map[string]interface{}{"entity": "user_99"})
	fmt.Println("Result:", res)
}
```

### 4. Java
```java
import io.cmox.plugins.tailscalemeshvpnsecureclusternode.TailscaleMeshVPNSecureClusterNodeJavaClient;

public class Main {
    public static void main(String[] args) throws Exception {
        var client = new TailscaleMeshVPNSecureClusterNodeJavaClient("http://localhost:7890");
        String result = client.ingest("insert", "{\"id\":101}");
        System.out.println("Result: " + result);
    }
}
```

---
*Maintained for CMOX Database Core Enterprise Marketplace.*

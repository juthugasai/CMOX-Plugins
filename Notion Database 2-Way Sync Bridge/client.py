"""
Notion Database 2-Way Sync Bridge - Official Python AsyncIO SDK
Module: cmox_plugin_notion_bridge
Author: Community
Version: v1.9.4
"""

import asyncio
import json
import time
import urllib.request
from typing import Dict, Any, Optional

class NotionDatabase2WaySyncBridgeEnginePythonClient:
    def __init__(self, bridge_url: str = "http://localhost:7890", api_key: Optional[str] = None):
        self.bridge_url = bridge_url.rstrip("/")
        self.api_key = api_key
        self.plugin_id = "notion-bridge"

    async def ingest(self, action: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Asynchronously ingests an event into Notion Database 2-Way Sync Bridge."""
        payload = {
            "jsonrpc": "2.0",
            "id": f"py_{int(time.time() * 1000)}",
            "method": "ingest",
            "params": {"action": action, "data": data}
        }
        req = urllib.request.Request(
            f"{self.bridge_url}/",
            data=json.dumps(payload).encode('utf-8'),
            headers={
                "Content-Type": "application/json",
                "X-CMOX-Plugin": self.plugin_id,
                **({"Authorization": f"Bearer {self.api_key}"} if self.api_key else {})
            },
            method="POST"
        )
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(None, urllib.request.urlopen, req)
        return json.loads(response.read().decode('utf-8')).get("result", {})

    async def get_health_report(self) -> Dict[str, Any]:
        """Fetches live health report and metrics."""
        req = urllib.request.Request(f"{self.bridge_url}/health")
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(None, urllib.request.urlopen, req)
        return json.loads(response.read().decode('utf-8'))

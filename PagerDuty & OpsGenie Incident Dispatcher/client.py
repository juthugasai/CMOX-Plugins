"""
PagerDuty & OpsGenie Incident Dispatcher - Official Python AsyncIO SDK
Module: cmox_plugin_pagerduty_dispatcher
Author: Incident Labs
Version: v1.5.0
"""

import asyncio
import json
import hashlib
import time
import urllib.request
from typing import Dict, Any, Optional

class PagerDutyOpsGenieIncidentDispatcherEnginePythonClient:
    def __init__(self, bridge_url: str = "http://localhost:7890", api_key: Optional[str] = None):
        self.bridge_url = bridge_url.rstrip("/")
        self.api_key = api_key
        self.plugin_id = "pagerduty-dispatcher"

    async def ingest(self, action: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Asynchronously ingests a transaction or mutation event into PagerDuty & OpsGenie Incident Dispatcher."""
        payload = {
            "jsonrpc": "2.0",
            "id": f"py_{int(time.time() * 1000)}",
            "method": "ingest",
            "params": {
                "action": action,
                "data": data
            }
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
        """Fetches live health report and metrics from PagerDuty & OpsGenie Incident Dispatcher."""
        req = urllib.request.Request(f"{self.bridge_url}/health")
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(None, urllib.request.urlopen, req)
        return json.loads(response.read().decode('utf-8'))

# Example Quickstart
if __name__ == "__main__":
    async def main():
        client = PagerDutyOpsGenieIncidentDispatcherEnginePythonClient()
        print("Connected to PagerDuty & OpsGenie Incident Dispatcher Python SDK")
        event = await client.ingest("insert", {"entity": "sample_record", "status": "active"})
        print("Ingested event:", event)
        health = await client.get_health_report()
        print("Health:", health.get("status"))

    asyncio.run(main())

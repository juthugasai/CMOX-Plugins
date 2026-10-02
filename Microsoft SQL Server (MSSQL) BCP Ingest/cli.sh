#!/usr/bin/env bash
BRIDGE_URL="${CMOX_BRIDGE_URL:-http://localhost:7890}"
echo "⚡ [Microsoft SQL Server (MSSQL) BCP Ingest] CMOX Universal CLI"

case "$1" in
  "health"|"status")
    curl -s -X GET "${BRIDGE_URL}/health" | jq .
    ;;
  "ingest")
    curl -s -X POST "${BRIDGE_URL}/" \
      -H "Content-Type: application/json" \
      -H "X-CMOX-Plugin: mssql-bcp-ingest" \
      -d "{\"action\": \"${2:-stream}\", \"data\": ${3:-{\"ping\": true}}}" | jq .
    ;;
  *)
    echo "Usage: $0 {health|status|ingest <action> <json_data>}"
    ;;
esac

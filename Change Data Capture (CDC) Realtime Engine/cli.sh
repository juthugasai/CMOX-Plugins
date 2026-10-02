#!/usr/bin/env bash
BRIDGE_URL="${CMOX_BRIDGE_URL:-http://localhost:7890}"
echo "⚡ [Change Data Capture (CDC) Realtime Engine] CMOX Universal CLI"

case "$1" in
  "health"|"status")
    curl -s -X GET "${BRIDGE_URL}/health" | jq .
    ;;
  "ingest")
    curl -s -X POST "${BRIDGE_URL}/" \
      -H "Content-Type: application/json" \
      -H "X-CMOX-Plugin: change-data-capture" \
      -d "{\"action\": \"${2:-stream}\", \"data\": ${3:-{\"ping\": true}}}" | jq .
    ;;
  *)
    echo "Usage: $0 {health|status|ingest <action> <json_data>}"
    ;;
esac

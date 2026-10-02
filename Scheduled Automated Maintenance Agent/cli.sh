#!/usr/bin/env bash
# ==============================================================================
# Scheduled Automated Maintenance Agent - Universal Command Line Interface
# Author: Community | Version: v2.0.0
# ==============================================================================

BRIDGE_URL="${CMOX_BRIDGE_URL:-http://localhost:7890}"

echo "⚡ [Scheduled Automated Maintenance Agent] CMOX CLI Interface"

case "$1" in
  "health"|"status")
    curl -s -X GET "${BRIDGE_URL}/health" | jq .
    ;;
  "ingest")
    ACTION="${2:-stream}"
    DATA="${3:-{\"ping\": true}}"
    curl -s -X POST "${BRIDGE_URL}/" \
      -H "Content-Type: application/json" \
      -H "X-CMOX-Plugin: auto-maintenance-agent" \
      -d "{\"action\": \"${ACTION}\", \"data\": ${DATA}}" | jq .
    ;;
  "ping")
    curl -s -X POST "${BRIDGE_URL}/" \
      -H "Content-Type: application/json" \
      -d '{"jsonrpc": "2.0", "id": 1, "method": "ping", "params": {}}' | jq .
    ;;
  *)
    echo "Usage: $0 {health|status|ingest <action> <json_data>|ping}"
    ;;
esac

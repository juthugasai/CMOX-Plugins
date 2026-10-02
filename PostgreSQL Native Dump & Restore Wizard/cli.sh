#!/usr/bin/env bash
# ==============================================================================
# PostgreSQL Native Dump & Restore Wizard - Universal Command Line Interface
# Author: CDUS Tech Core | Version: v3.5.0
# ==============================================================================

BRIDGE_URL="${CMOX_BRIDGE_URL:-http://localhost:7890}"

echo "⚡ [PostgreSQL Native Dump & Restore Wizard] CMOX CLI Interface"

case "$1" in
  "health"|"status")
    curl -s -X GET "${BRIDGE_URL}/health" | jq .
    ;;
  "ingest")
    ACTION="${2:-stream}"
    DATA="${3:-{\"ping\": true}}"
    curl -s -X POST "${BRIDGE_URL}/" \
      -H "Content-Type: application/json" \
      -H "X-CMOX-Plugin: postgres-native-wizard" \
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

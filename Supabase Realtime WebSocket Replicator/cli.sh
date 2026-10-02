#!/usr/bin/env bash
# ==============================================================================
# Supabase Realtime WebSocket Replicator - Universal Command Line Interface
# Author: CDUS Tech Core | Version: v3.1.0
# ==============================================================================

BRIDGE_URL="${CMOX_BRIDGE_URL:-http://localhost:7890}"

echo "⚡ [Supabase Realtime WebSocket Replicator] CMOX CLI Interface"

case "$1" in
  "health"|"status")
    curl -s -X GET "${BRIDGE_URL}/health" | jq .
    ;;
  "ingest")
    ACTION="${2:-stream}"
    DATA="${3:-{\"ping\": true}}"
    curl -s -X POST "${BRIDGE_URL}/" \
      -H "Content-Type: application/json" \
      -H "X-CMOX-Plugin: supabase-replicator" \
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

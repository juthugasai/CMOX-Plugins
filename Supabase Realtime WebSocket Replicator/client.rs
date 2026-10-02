//! Supabase Realtime WebSocket Replicator - Official Rust Tokio SDK
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct StreamPayload<T> {
    pub id: String,
    pub timestamp: u128,
    pub action: String,
    pub data: T,
}

pub struct SupabaseRealtimeWebSocketReplicatorEngineRustClient {
    pub bridge_url: String,
}

impl SupabaseRealtimeWebSocketReplicatorEngineRustClient {
    pub fn new(bridge_url: &str) -> Self {
        Self {
            bridge_url: bridge_url.trim_end_matches('/').to_string(),
        }
    }
}

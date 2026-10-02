//! ClickHouse High-Throughput Analytics Driver - Official Rust Tokio SDK
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct StreamPayload<T> {
    pub id: String,
    pub timestamp: u128,
    pub action: String,
    pub data: T,
}

pub struct ClickHouseHighThroughputAnalyticsDriverEngineRustClient {
    pub bridge_url: String,
}

impl ClickHouseHighThroughputAnalyticsDriverEngineRustClient {
    pub fn new(bridge_url: &str) -> Self {
        Self {
            bridge_url: bridge_url.trim_end_matches('/').to_string(),
        }
    }
}

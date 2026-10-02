//! GraphQL Auto-Gateway & Subscriptions - Official Rust Tokio SDK
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct StreamPayload<T> {
    pub id: String,
    pub timestamp: u128,
    pub action: String,
    pub data: T,
}

pub struct GraphQLAutoGatewaySubscriptionsEngineRustClient {
    pub bridge_url: String,
}

impl GraphQLAutoGatewaySubscriptionsEngineRustClient {
    pub fn new(bridge_url: &str) -> Self {
        Self {
            bridge_url: bridge_url.trim_end_matches('/').to_string(),
        }
    }
}

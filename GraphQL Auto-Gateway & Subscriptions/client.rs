//! GraphQL Auto-Gateway & Subscriptions - Official Rust Tokio SDK
//! Crate: cmox_plugin_graphql_gateway
//! Author: CDUS Tech Core

use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};

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

    pub fn build_payload<T: Serialize>(&self, action: &str, data: T) -> StreamPayload<T> {
        let timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis();

        StreamPayload {
            id: format!("rs_{}", timestamp),
            timestamp,
            action: action.to_string(),
            data,
        }
    }
}

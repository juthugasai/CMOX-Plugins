//! Regulatory Compliance Report Generator (SOC2/ISO27001) - Official Rust Tokio SDK
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct StreamPayload<T> {
    pub id: String,
    pub timestamp: u128,
    pub action: String,
    pub data: T,
}

pub struct RegulatoryComplianceReportGeneratorSOC2ISO27001EngineRustClient {
    pub bridge_url: String,
}

impl RegulatoryComplianceReportGeneratorSOC2ISO27001EngineRustClient {
    pub fn new(bridge_url: &str) -> Self {
        Self {
            bridge_url: bridge_url.trim_end_matches('/').to_string(),
        }
    }
}

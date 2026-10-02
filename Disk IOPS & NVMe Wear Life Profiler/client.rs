//! Disk IOPS & NVMe Wear Life Profiler - Official Rust Tokio SDK
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct StreamPayload<T> {
    pub id: String,
    pub timestamp: u128,
    pub action: String,
    pub data: T,
}

pub struct DiskIOPSNVMeWearLifeProfilerEngineRustClient {
    pub bridge_url: String,
}

impl DiskIOPSNVMeWearLifeProfilerEngineRustClient {
    pub fn new(bridge_url: &str) -> Self {
        Self {
            bridge_url: bridge_url.trim_end_matches('/').to_string(),
        }
    }
}

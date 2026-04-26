use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Deserialize, TS)]
#[ts(export, export_to = "../client/output.ts")]
pub struct QueryAgentData {
    pub url: Option<String>,
    #[serde(rename = "type")]
    pub content_type: Option<String>,
}

#[derive(Serialize, TS)]
#[ts(export, export_to = "../client/output.ts")]
pub struct ResViewData {
    pub slug: String,
    pub count: u32,
}

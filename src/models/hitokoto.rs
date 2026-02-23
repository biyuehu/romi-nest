use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Deserialize, TS)]
#[ts(export, export_to = "../client/output.ts")]
pub struct ReqHitokotoData {
    pub msg: String,
    pub from: String,
    pub r#type: u32,
    pub is_public: bool,
}

#[derive(Serialize, TS)]
#[ts(export, export_to = "../client/output.ts")]
pub struct ResHitokotoData {
    pub id: u32,
    pub msg: String,
    pub from: String,
    pub r#type: u32,
    pub likes: i32,
    pub is_public: bool,
}

#[derive(Deserialize, TS)]
#[ts(export, export_to = "../client/output.ts")]
pub struct ReqHitokoto2Data {
    pub msg: String,
    pub msg_origin: Option<String>,
    pub from: Option<String>,
    pub from_who: Option<String>,
    pub r#type: i8,
    pub is_public: bool,
}

#[derive(Serialize, TS)]
#[ts(export, export_to = "../client/output.ts")]
pub struct ResHitokoto2Data {
    pub uuid: String,
    pub msg: String,
    pub msg_origin: Option<String>,
    pub from: Option<String>,
    pub from_who: Option<String>,
    pub r#type: i8,
    pub likes: i32,
    pub is_public: bool,
    pub created: u32,
}

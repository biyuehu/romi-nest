use serde::{Deserialize, Serialize};
use ts_rs::TS;
use utoipa::{IntoParams, ToSchema};

#[derive(Deserialize, TS, IntoParams, ToSchema)]
#[ts(export, export_to = "../client/output.ts")]
pub struct QuerySeimgData {
  pub limit: Option<u32>,
  pub tag: Option<String>,
  pub r18: Option<String>,
}

#[derive(Deserialize, TS, ToSchema)]
#[ts(export, export_to = "../client/output.ts")]
pub struct ReqSeimgData {
  pub pixiv_pid: u32,
  pub pixiv_uid: u32,
  pub title: String,
  pub author: String,
  pub r18: bool,
  pub tags: Vec<String>,
  pub width: u32,
  pub height: u32,
  pub r#type: String,
  pub url: String,
}

#[derive(Serialize, TS, ToSchema)]
#[ts(export, export_to = "../client/output.ts")]
pub struct ResSeimgData {
  pub pid: u32,
  pub uid: u32,
  pub title: String,
  pub author: String,
  pub r18: bool,
  pub tags: Vec<String>,
  pub width: u32,
  pub height: u32,
  pub r#type: String,
  pub url: String,
}

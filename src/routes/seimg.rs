use axum::{
  Json, Router,
  extract::{Path, Query, State},
  routing::{delete, get, post, put},
};
use roga::*;

use crate::{
  app::RomiState,
  guards::admin::AdminUser,
  models::seimg::{QuerySeimgData, ReqSeimgData, ResSeimgData},
  service::seimg::{self, SeimgError},
  utils::api::{ApiError, ApiResult, api_ok},
};

pub fn routes() -> Router<RomiState> {
  Router::new()
    .route("/", get(list))
    .route("/", post(create))
    .route("/{id}", put(update))
    .route("/{id}", delete(remove))
}

/// Returns a random list of illustrations/seimgs based on query filters.
#[utoipa::path(
  get,
  path = "/api/seimg",
  params(QuerySeimgData),
  responses((status = 200, description = "List of seimgs", body = Vec<ResSeimgData>))
)]
pub async fn list(
  Query(params): Query<QuerySeimgData>,
  State(RomiState { ref conn, ref logger, .. }): State<RomiState>,
) -> ApiResult<Vec<ResSeimgData>> {
  let limit = params.limit.unwrap_or(1).clamp(1, 10);
  let tag = params.tag;
  let r18 = params.r18;

  match seimg::list(conn, limit, tag, r18).await {
    Ok(data) => api_ok(data),
    Err(e) => {
      l_error!(logger, "Failed to list seimgs: {:#}", e);
      Err(ApiError::internal("Failed to list seimgs"))
    }
  }
}

async fn create(
  AdminUser(admin_user): AdminUser,
  State(RomiState { ref logger, ref conn, .. }): State<RomiState>,
  Json(data): Json<ReqSeimgData>,
) -> ApiResult {
  match seimg::create(conn, data).await {
    Ok(result) => {
      l_info!(
        logger,
        "Created seimg id {} ({}) by admin {} ({})",
        result.id,
        result.title,
        admin_user.id,
        admin_user.username
      );
      api_ok(())
    }
    Err(e) => {
      l_error!(logger, "Failed to create seimg: {:#}", e);
      Err(ApiError::internal("Failed to create seimg"))
    }
  }
}

async fn update(
  AdminUser(admin_user): AdminUser,
  Path(id): Path<u32>,
  State(RomiState { ref logger, ref conn, .. }): State<RomiState>,
  Json(data): Json<ReqSeimgData>,
) -> ApiResult {
  match seimg::update(conn, id, data).await {
    Ok(result) => {
      l_info!(
        logger,
        "Updated seimg {} ({}) by admin {} ({})",
        id,
        result.title,
        admin_user.id,
        admin_user.username
      );
      api_ok(())
    }
    Err(e) if e.downcast_ref::<SeimgError>().is_some() => {
      l_warn!(logger, "Seimg {} not found", id);
      Err(ApiError::not_found(format!("Seimg {} not found", id)))
    }
    Err(e) => {
      l_error!(logger, "Failed to update seimg {}: {:#}", id, e);
      Err(ApiError::internal("Failed to update seimg"))
    }
  }
}

async fn remove(
  AdminUser(admin_user): AdminUser,
  Path(id): Path<u32>,
  State(RomiState { ref logger, ref conn, .. }): State<RomiState>,
) -> ApiResult {
  match seimg::remove(conn, id).await {
    Ok(_) => {
      l_info!(logger, "Removed seimg {} by admin {} ({})", id, admin_user.id, admin_user.username);
      api_ok(())
    }
    Err(e) => {
      l_error!(logger, "Failed to remove seimg {}: {:#}", id, e);
      Err(ApiError::internal("Failed to remove seimg"))
    }
  }
}

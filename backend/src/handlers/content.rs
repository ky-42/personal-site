use super::{errors::ContentError, extractors::AuthUser};
use crate::db::{
    models::{FullContent, NewFullContent, PageInfo},
    ops::content_ops,
    DbPool,
};
use actix_web::{web, HttpResponse};
use serde::Deserialize;

// ######################################################################################################
// ------------------------------------------------------------------------------------------------------
// ######################################################################################################

// Enums used in routes

// Used to get content slug out of routes
#[derive(Deserialize, Debug)]
pub struct ContentSlug {
    slug: String,
}

// ######################################################################################################
// ------------------------------------------------------------------------------------------------------
// ######################################################################################################

// Returns a list of content
pub async fn list_content(
    db_pool: web::Data<DbPool>,
    page_info: web::Json<PageInfo>,
) -> Result<web::Json<Vec<FullContent>>, ContentError> {
    let fetched_content_list = web::block(move || {
        let conn = db_pool.get()?;
        content_ops::view_content_list(&conn, page_info.into_inner())
    })
    .await??;
    Ok(web::Json(fetched_content_list))
}
// CRUD routes for content

// Returns a single peice of content
pub async fn view_content(
    db_pool: web::Data<DbPool>,
    slug_requested: web::Path<ContentSlug>,
) -> Result<web::Json<FullContent>, ContentError> {
    let fetched_content = web::block(move || {
        let conn = db_pool.get()?;
        content_ops::view_content(&conn, &slug_requested.into_inner().slug)
    })
    .await??;
    Ok(web::Json(fetched_content))
}

pub async fn update_content(
    db_pool: web::Data<DbPool>,
    _content_info: web::Path<ContentSlug>,
    update_info: web::Json<FullContent>,
) -> Result<HttpResponse, ContentError> {
    web::block(move || {
        let conn = db_pool.get()?;
        content_ops::update_content(&conn, update_info.into_inner())
    })
    .await??;
    Ok(HttpResponse::Ok().finish())
}

pub async fn delete_content(
    db_pool: web::Data<DbPool>,
    delete_slug: web::Path<ContentSlug>,
) -> Result<HttpResponse, ContentError> {
    // Returns the number of rows deleted
    let rows_deleted = web::block(move || {
        let conn = db_pool.get()?;
        content_ops::delete_content(&conn, delete_slug.into_inner().slug)
    })
    .await??;
    Ok(HttpResponse::Ok().json(format!(
        r#"
    {{
        "rows_deleted": "{}"
    }}
    "#,
        rows_deleted
    )))
}

pub async fn add_content(
    db_pool: web::Data<DbPool>,
    add_info: web::Json<NewFullContent>,
    _: AuthUser,
) -> Result<HttpResponse, ContentError> {
    web::block(move || {
        let conn = db_pool.get()?;
        content_ops::add_content(&conn, add_info.into_inner())
    })
    .await??;
    Ok(HttpResponse::Ok().finish())
}

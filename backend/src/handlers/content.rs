use super::errors::ContentError;
use crate::db::{
    models::{ContentType, FullContent, NewFullContent, PageInfo},
    ops::content_ops,
    DbPool,
};
use actix_web::{
    error,
    http::{header, StatusCode},
    web, HttpResponse,
};
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
) -> Result<HttpResponse, ContentError> {
    web::block(move || {
        let conn = db_pool.get()?;
        content_ops::add_content(&conn, add_info.into_inner())
    })
    .await??;
    Ok(HttpResponse::Ok().finish())
}

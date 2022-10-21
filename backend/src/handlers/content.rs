use super::{errors::ContentError, extractors::AuthUser};
use crate::db::{
    models::{ContentType, FullContent, NewFullContent, PageInfo, DbRows},
    ops::content_ops,
    DbPool,
};
use actix_web::{web, HttpResponse};
use serde::{Deserialize, Serialize};

// ######################################################################################################
// ------------------------------------------------------------------------------------------------------
// ######################################################################################################

// Enums used in routes

// Used to get content slug out of routes
#[derive(Deserialize, Debug)]
pub struct ContentSlug {
    slug: String,
}

// Used in count_content func to return a json count
#[derive(Serialize, Debug)]
pub struct CountReturn {
    count: i64    
}

// ######################################################################################################
// ------------------------------------------------------------------------------------------------------
// ######################################################################################################
// 

pub async fn under_dev_projects (
    db_pool: web::Data<DbPool>
) -> Result<web::Json<Vec<FullContent>>, ContentError> {

    let fetched_projects = web::block(move || {
        let mut conn = db_pool.get()?;
        content_ops::view_under_dev_projects(&mut conn)
    })
    .await??;
    Ok(web::Json(fetched_projects))
}

// Returns a list of content including its extra content
// For projects only returns finished projects
pub async fn list_content(
    db_pool: web::Data<DbPool>,
    page_info: web::Query<PageInfo>,
) -> Result<web::Json<Vec<FullContent>>, ContentError> {
    let fetched_content_list = web::block(move || {
        let mut conn = db_pool.get()?;
        content_ops::view_content_list(&mut conn, page_info.into_inner())
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
        let mut conn = db_pool.get()?;
        content_ops::view_content(&mut conn, &slug_requested.into_inner().slug)
    })
    .await??;
    Ok(web::Json(fetched_content))
}

pub async fn update_content(
    db_pool: web::Data<DbPool>,
    _content_info: web::Path<ContentSlug>,
    update_info: web::Json<FullContent>,
    _: AuthUser,
) -> Result<HttpResponse, ContentError> {
    web::block(move || {
        let mut conn = db_pool.get()?;
        content_ops::update_content(&mut conn, update_info.into_inner())
    })
    .await??;
    Ok(HttpResponse::Ok().finish())
}

pub async fn delete_content(
    db_pool: web::Data<DbPool>,
    delete_slug: web::Path<ContentSlug>,
    _: AuthUser,
) -> Result<web::Json<DbRows>, ContentError> {
    // Returns the number of rows deleted
    let rows_deleted = web::block(move || {
        let mut conn = db_pool.get()?;
        content_ops::delete_content(&mut conn, delete_slug.into_inner().slug)
    })
    .await?? as i32;
    Ok(web::Json(DbRows {
        rows_effected: rows_deleted
    }))
}

pub async fn add_content(
    db_pool: web::Data<DbPool>,
    add_info: web::Json<NewFullContent>,
    _: AuthUser,
) -> Result<HttpResponse, ContentError> {
    web::block(move || {
        let mut conn = db_pool.get()?;
        content_ops::add_content(&mut conn, add_info.into_inner())
    })
    .await??;
    Ok(HttpResponse::Ok().finish())
}


pub async fn count_content(
    db_pool: web::Data<DbPool>,
    count_type: web::Path<ContentType>
) -> Result<web::Json<CountReturn>, ContentError> {
    let count = web::block(move || {
        let mut conn = db_pool.get()?;
        content_ops::content_count(&mut conn, count_type.into_inner())
    })
    .await??;
    Ok(web::Json(CountReturn{
        count
    }))
}
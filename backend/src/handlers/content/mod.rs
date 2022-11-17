use super::{errors::AppError, extractors::AuthUser, route_data};
use crate::db::{
    models::content::{ FullContent, NewFullContent, ContentType },
    ops::content_ops,
    DbPool,
};
use actix_web::{web, HttpResponse};
use serde::{Deserialize, Serialize};

/* -------------------------------------------------------------------------- */
/*                         Responder Specific Structs                         */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                                 Responders                                 */
/* -------------------------------------------------------------------------- */

// Returns all the projects that are under development
pub async fn under_dev_projects (
    db_pool: web::Data<DbPool>
) -> Result<web::Json<Vec<FullContent>>, AppError> {
    let fetched_projects: Vec<FullContent> = web::block(move || {
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
    page_info: web::Query<route_data::PageInfo>,
) -> Result<web::Json<Vec<FullContent>>, AppError> {
    let fetched_content_list: Vec<FullContent> = web::block(move || {
        let mut conn = db_pool.get()?;
        content_ops::view_content_list(&mut conn, page_info.into_inner())
    })
    .await??;

    Ok(web::Json(fetched_content_list))
}

// Returns how of a type of content the site has
pub async fn count_content(
    db_pool: web::Data<DbPool>,
    count_type: web::Path<ContentType>
) -> Result<web::Json<CountReturn>, AppError> {
    let count = web::block(move || {
        let mut conn = db_pool.get()?;
        content_ops::content_count(&mut conn, count_type.into_inner())
    })
    .await??;

    Ok(web::Json(CountReturn{
        count
    }))
}

/* ----------------------- CRUD routes for content ----------------------- */

// Returns a single peice of content
pub async fn view_content(
    db_pool: web::Data<DbPool>,
    slug_requested: web::Path<ContentSlug>,
) -> Result<web::Json<FullContent>, AppError> {
    let fetched_content: FullContent = web::block(move || {
        let mut conn = db_pool.get()?;
        content_ops::view_content(&mut conn, &slug_requested.into_inner().slug)
    })
    .await??;

    Ok(web::Json(fetched_content))
}

// Updates a peice of content given a full content object then includes all values
// not just the updated properties 
pub async fn update_content(
    db_pool: web::Data<DbPool>,
    _content_info: web::Path<ContentSlug>,
    update_info: web::Json<FullContent>,
    _: AuthUser,
) -> Result<HttpResponse, AppError> {
    web::block(move || {
        let mut conn = db_pool.get()?;
        content_ops::update_content(&mut conn, update_info.into_inner())
    })
    .await??;

    Ok(HttpResponse::Ok().finish())
}

// Deletes a peice of content given the slug
pub async fn delete_content(
    db_pool: web::Data<DbPool>,
    delete_slug: web::Path<ContentSlug>,
    _: AuthUser,
) -> Result<web::Json<route_data::DbRows>, AppError> {
    // Returns the number of rows deleted
    let rows_deleted = web::block(move || {
        let mut conn = db_pool.get()?;
        content_ops::delete_content(&mut conn, delete_slug.into_inner().slug)
    })
    .await?? as i32;

    Ok(web::Json(route_data::DbRows{
        rows_effected: rows_deleted
    }))
}

// Adds a peice of content given data for the new content
pub async fn add_content(
    db_pool: web::Data<DbPool>,
    add_info: web::Json<NewFullContent>,
    _: AuthUser,
) -> Result<HttpResponse, AppError> {
    web::block(move || {
        let mut conn = db_pool.get()?;
        content_ops::add_content(&mut conn, add_info.into_inner())
    })
    .await??;

    Ok(HttpResponse::Ok().finish())
}
use super::{errors::AppError, extractors::AuthUser, route_data};
use crate::db::{
    models::content::{ FullContent, NewFullContent, FullContentList, ContentFilter, ops },

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

// Returns a list of content including its extra content
// For projects only returns finished projects
pub async fn list_content(
    db_pool: web::Data<DbPool>,
    page_info: web::Query<route_data::PageInfo>,
    query_filters: web::Query<ContentFilter>
) -> Result<web::Json<FullContentList>, AppError> {
    let fetched_content_list: FullContentList = web::block(move || {
        let mut db_conn = db_pool.get()?;
        FullContentList::list(page_info.into_inner(), query_filters.into_inner(), &mut db_conn)
    })
    .await??;

    Ok(web::Json(fetched_content_list))
}

/* ----------------------- CRUD routes for content ----------------------- */

// Returns a single peice of content
pub async fn view_content(
    db_pool: web::Data<DbPool>,
    slug_requested: web::Path<ContentSlug>,
) -> Result<web::Json<FullContent>, AppError> {
    let fetched_content: FullContent = web::block(move || {
        let mut db_conn = db_pool.get()?;
        FullContent::view(slug_requested.into_inner().slug, &mut db_conn)
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
        let mut db_conn = db_pool.get()?;
        update_info.into_inner().update(&mut db_conn)
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
        let mut db_conn = db_pool.get()?;
        FullContent::delete(delete_slug.into_inner().slug, &mut db_conn)
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
        let mut db_conn = db_pool.get()?;
        add_info.into_inner().add(&mut db_conn)
    })
    .await??;

    Ok(HttpResponse::Ok().finish())
}
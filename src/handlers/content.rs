use actix_web::{
    web,
    HttpResponse,
    error,
    http::{
        StatusCode,
        header
    }
};
use serde::{
    Deserialize
};
use crate::db::{
    models::{
        ContentType,
        FullContent
    },
    ops::content_ops,
    DbPool,
};
use super::errors::{
    ContentError
};

// ######################################################################################################
// ------------------------------------------------------------------------------------------------------
// ######################################################################################################
// ######################################################################################################
// ------------------------------------------------------------------------------------------------------
// ######################################################################################################

#[derive(Deserialize, Debug)]
pub struct ContentInfo {
    pub content_type: ContentType,
    pub content_slug: Option<String>
}

#[derive(Deserialize, Debug)]
pub struct PageInfo {
    page: Option<i32>,
    content_per_page: Option<i32>
}

#[derive(Deserialize, Debug)]
pub struct ContentAddInfo {
    content_type: ContentType,
    slug: String,
    title: String,
    content_desc: Option<String>,
    body: String,
    current_status: Option<String>,
    tags: Option<Vec<String>>
}

// ######################################################################################################
// ------------------------------------------------------------------------------------------------------
// ######################################################################################################

pub async fn view_content(
    db_pool: web::Data<DbPool>, 
    content_info: web::Path<ContentInfo>
) -> Result<web::Json<FullContent>, ContentError> {
    let recived_content_slug = get_slug(content_info.into_inner())?;
    let fetched_content = web::block(move || {
        let conn = db_pool.get()?;
        content_ops::view_content(
            &conn,
            &recived_content_slug
        )
    })
    .await??;
    Ok(web::Json(fetched_content))
}

pub async fn recent_content(
    db_pool: web::Data<DbPool>, 
    content_info: web::Path<ContentInfo>,
    page_info: web::Query<PageInfo>
) -> HttpResponse {
    HttpResponse::Ok().finish()
}

pub async fn update_content(
    db_pool: web::Data<DbPool>, 
    content_info: web::Path<ContentInfo>,
    // update_info: Json<>
) -> HttpResponse {
    HttpResponse::Ok().finish()
}

pub async fn delete_content(
    db_pool: web::Data<DbPool>, 
    content_info: web::Path<ContentInfo>,
) -> HttpResponse {
    HttpResponse::Ok().finish()
}

pub async fn add_content(
    db_pool: web::Data<DbPool>, 
    add_info: web::Json<ContentAddInfo>
) -> HttpResponse{
    HttpResponse::Ok().finish()   
}

fn get_slug(requested_content_info: ContentInfo) -> Result<String, ContentError> {
    if let Some(possible_slug) = requested_content_info.content_slug {
        Ok(possible_slug)
    } else {
        Err(ContentError::NoSlugProvided)
    }   
}

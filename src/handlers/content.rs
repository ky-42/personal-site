use actix_web::{
    web::{
        Path,
        Query,
        Json
    },
    HttpResponse,
};
use serde::{
    Deserialize
};

use crate::db::{
    models::{
        ContentType
    },
    ops::content_ops,
};

// ######################################################################################################
// ------------------------------------------------------------------------------------------------------
// ######################################################################################################

// ######################################################################################################
// ------------------------------------------------------------------------------------------------------
// ######################################################################################################

#[derive(Deserialize, Debug)]
pub struct ContentInfo {
    content_type: ContentType,
    content_slug: Option<String>
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

pub async fn view_content(content_info: Path<ContentInfo>) -> HttpResponse {
    println!("{}", content_info.into_inner().content_slug.unwrap());
    HttpResponse::Ok().finish()
}

pub async fn recent_content(
    content_info: Path<ContentInfo>,
    page_info: Query<PageInfo>
) -> HttpResponse {
    HttpResponse::Ok().finish()
}

pub async fn update_content(
    content_info: Path<ContentInfo>,
    // update_info: Json<>
) -> HttpResponse {
    HttpResponse::Ok().finish()
}

pub async fn delete_content(
    content_info: Path<ContentInfo>,
) -> HttpResponse {
    HttpResponse::Ok().finish()
}

pub async fn add_content(
    add_info: Json<ContentAddInfo>
) -> HttpResponse{
    HttpResponse::Ok().finish()   
}
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

// ######################################################################################################
// ------------------------------------------------------------------------------------------------------
// ######################################################################################################

#[derive(Deserialize, Debug)]
#[serde(rename_all = "lowercase")]
pub enum ContentType {
    Blog,
    Project
}

#[derive(Deserialize, Debug)]
enum ProjectStatus {
    UnderDevelopment,
    Unfinished,
    Finished
}

#[derive(Deserialize, Debug)]
enum ContentTags {
    WebDev,
    Rust,
    Python,
    TypeScript
}
// ######################################################################################################
// ------------------------------------------------------------------------------------------------------
// ######################################################################################################

#[derive(Deserialize, Debug)]
pub struct ContentToAdd {
    title: String,
    desc: Option<String>,
    body: String,
    project_status: Option<ProjectStatus>,
    tags: Option<ContentTags> 
}

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
    add_info: Json<ContentToAdd>
) -> HttpResponse{
    HttpResponse::Ok().finish()   
}
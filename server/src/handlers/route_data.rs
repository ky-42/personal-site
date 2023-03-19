use serde::{self, Deserialize, Serialize};

use crate::db::models::content::FullContent;

// Data used in routes to extract data from request and return data to requester
/* -------------------------------------------------------------------------- */

#[derive(Deserialize, Serialize, Debug)]
pub struct DbRows {
    pub rows_effected: i32
}

#[derive(Serialize, Debug)]
pub struct SurroundingBlogs {
    pub before_blogs: Vec<FullContent>, 
    pub after_blogs: Vec<FullContent>
}

#[derive(Deserialize, Debug)]
pub enum ShowOrder {
    Newest,
    Oldest,
    ProjectStartNewest,
    ProjectStartOldest
}

#[derive(Deserialize, Debug)]
pub struct PageInfo {
    pub content_per_page: i64,
    pub page: i64,
    pub show_order: ShowOrder
}

impl Default for PageInfo {
    fn default() -> PageInfo {
        PageInfo {
            content_per_page: 4,
            page: 1,
            show_order: ShowOrder::Newest,
        }
    }
}

#[derive(Deserialize, Debug)]
pub struct ContentSlug {
    pub slug: String,
}

#[derive(Serialize, Debug)]
pub struct CountReturn {
    count: i64    
}

#[derive(Deserialize, Debug)]
pub struct ContentId {
    pub id: i32
}

#[derive(Deserialize, Debug)]
pub struct TagsToAdd {
    pub tags: Vec<String>
}

#[derive(Deserialize, Debug)]
pub struct DevblogTitle {
    pub title: String
}

#[derive(Deserialize, Debug)]
pub struct SurroundingData {
    pub devblog_id: i32,
    pub blog_slug: String,
    pub direction_count: i64,
}
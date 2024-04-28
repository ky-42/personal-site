use serde::{self, Deserialize, Serialize};

use crate::db::models::content::FullContent;

/* -------------------------------------------------------------------------- */
// Data used in routes to extract data from request and return data to requester

#[derive(Deserialize, Debug)]
#[serde(rename_all = "snake_case")]
pub enum ShowOrder {
    Newest,
    Oldest,
    ProjectStartNewest,
    ProjectStartOldest,
}

#[derive(Deserialize, Debug)]
pub struct PageInfo {
    pub content_per_page: i64,
    pub page: i64,
    pub ordering: ShowOrder,
}

impl Default for PageInfo {
    fn default() -> PageInfo {
        PageInfo {
            content_per_page: 4,
            page: 1,
            ordering: ShowOrder::Newest,
        }
    }
}

#[derive(Deserialize, Debug)]
pub struct ContentSlug {
    pub slug: String,
}

#[derive(Serialize, Debug)]
pub struct CountReturn {
    count: i64,
}

#[derive(Deserialize, Debug)]
pub struct IdStruct {
    pub id: i32,
}

#[derive(Deserialize, Debug)]
pub struct TagsToAdd {
    pub tags: Vec<String>,
}

#[derive(Deserialize, Debug)]
pub struct DevblogTitle {
    pub title: String,
}

#[derive(Deserialize, Debug)]
pub struct GetSurroundingData {
    pub devblog_id: i32,
    pub pivot_blog_slug: String,
    pub neighbor_blog_count: i64,
}

#[derive(Serialize, Debug)]
pub struct SurroundingBlogs {
    pub before_blogs: Vec<FullContent>,
    pub after_blogs: Vec<FullContent>,
}

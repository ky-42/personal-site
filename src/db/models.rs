use serde::{
    Deserialize,
    Serialize
};
use chrono::DateTime;
use serde;

// ######################################################################################################
// ------------------------------------------------------------------------------------------------------
// ######################################################################################################

enum ContentType {
    Blog,
    Project
}

enum ProjectStatus {
    UnderDevelopment,
    Unfinished,
    Finished
}

// ######################################################################################################
// ------------------------------------------------------------------------------------------------------
// ######################################################################################################


#[derive(Queryable)]
struct Content {
    id: i32,
    content_type: ContentType,
    slug: String,
    title: String,
    content_desc: Option<String>,
    body: String,
    created_at: DateTime,
    updated_at: DateTime,
    project_id: Option<i32>,
    blog_id: Option<i32>
}

struct NewContent {
    content_type: ContentType,
    title: String,
    content_desc: Option<String>,
    body: String,
    project_status: Option<ProjectStatus>,
    blog_tags: Option<String[]>
}

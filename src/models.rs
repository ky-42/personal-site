use serde::{
    Deserialize,
    Serialize
};
use chrono::DateTime;

enum ContentType {
    Blog,
    Project
}

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
struct Content {
    id: i32,
    content_type: ContentType,
    slug: String,
    title: String,
    pub desc: Option<String>,
    created_at: DateTime,
    updated_at: DateTime,
    body: String,
}



struct Project {
    project_status: ProjectStatus
}


struct Blog {
    tags: BlogTags[]
}

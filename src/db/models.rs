use diesel::prelude::*;
use serde::{
    self,
    Deserialize,
    Serialize
};
use chrono::{
    DateTime,
    Utc
};
use crate::schema::{
    content,
    project,
    blog
};

// ######################################################################################################
// ------------------------------------------------------------------------------------------------------
// ######################################################################################################

#[derive(Debug, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ContentType {
    Blog,
    Project
}

impl From<String> for ContentType {
    fn from(content_type: String) -> Self {
        let content_type: &str = &content_type;
        match content_type {
            "blog" => ContentType::Blog,
            "project" => ContentType::Project,
        }
    }
}

impl From<ContentType> for String {
    fn from(content_type: ContentType) -> Self {
        match content_type {
            ContentType::Blog => "blog".to_owned(),
            ContentType::Project => "project".to_owned()
        }
    }   
}

#[derive(Debug)]
enum ProjectStatus {
    UnderDevelopment,
    Unfinished,
    Finished
}

impl From<String> for ProjectStatus {
    fn from(project_status: String) -> Self {
        let project_status: &str = &project_status;
        match project_status {
            "Unfinished" => ProjectStatus::Unfinished,
            "Under Development" => ProjectStatus::UnderDevelopment,
            "Finished" => ProjectStatus::Finished
        }
    }
}

impl From<ProjectStatus> for String {
    fn from(project_status: ProjectStatus) -> Self {
        match project_status {
            ProjectStatus::Unfinished => "Unfinished".to_owned(),
            ProjectStatus::UnderDevelopment => "Under Development".to_owned(),
            ProjectStatus::Finished => "Finished".to_owned()
        }
    }
}

// ######################################################################################################
// ------------------------------------------------------------------------------------------------------
// ######################################################################################################

#[derive(Queryable, Identifiable, Debug)]
#[table_name = "content" ]
struct Content {
    id: i32,
    #[diesel(deserialize_as = String)]
    content_type: ContentType,
    slug: String,
    title: String,
    content_desc: Option<String>,
    body: String,
    created_at: DateTime<Utc>,
    updated_at: DateTime<Utc>,
}

#[derive(Queryable, Identifiable, Debug)]
#[table_name = "project" ]
#[diesel(belongs_to(Content))]
struct Project {
    id: i32,
    content_id: i32,
    #[diesel(deserialize_as = String)]
    current_status: ProjectStatus
}

#[derive(Queryable, Identifiable, Debug)]
#[table_name = "blog" ]
#[diesel(belongs_to(Content))]
struct Blog {
    id: i32,
    content_id: i32,
    tags: Option<Vec<String>>
}

#[derive(Insertable, AsChangeset, Debug)]
#[table_name = "content" ]
struct NewContent {
    content_type: String,
    slug: String,
    title: String,
    content_desc: Option<String>,
    body: String
}

#[derive(Insertable, AsChangeset, Debug)]
#[table_name = "project" ]
struct NewProject {
    current_status: String
}

#[derive(Insertable, AsChangeset, Debug)]
#[table_name = "blog" ]
struct NewBlog {
    tags: Option<Vec<String>>
}
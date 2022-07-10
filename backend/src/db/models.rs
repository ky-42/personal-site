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

// Info for getting a list of content

#[derive(Deserialize, Debug)]
pub enum ShowOrder {
    newest,
    oldest,
    most_popular,
    least_popular,
    search(String),
}

#[derive(Deserialize, Debug)]
pub struct PageInfo {
    pub content_per_page: i64,
    pub page: i64,
    pub show_order: ShowOrder,
    pub content_type: Option<ContentType>
}

impl Default for PageInfo {
    fn default() -> PageInfo {
        PageInfo {
            content_per_page: 4,
            page: 1,
            show_order: ShowOrder::newest,
            content_type: None
        }
    }
}

// ######################################################################################################
// ------------------------------------------------------------------------------------------------------
// ######################################################################################################

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ContentType {
    Blog,
    Project
}

// Used to convert content type to a string to insert into db
impl From<ContentType> for String {
    fn from(content_type: ContentType) -> Self {
        match content_type {
            ContentType::Blog => "blog".to_owned(),
            ContentType::Project => "project".to_owned()
        }
    }   
}

#[derive(Serialize, Deserialize, Debug)]
pub enum ExtraContent {
    Blog(Blog),
    Project(Project)
}

#[derive(Deserialize, Debug)]
pub enum NewExtraContent {
    Blog(NewBlog),
    Project(NewProject)
}

// ######################################################################################################
// ------------------------------------------------------------------------------------------------------
// ######################################################################################################

// Structs for getting and updating data from db

//TODO make a model that is changeable that dont have
// times or id and are all option feilds
#[derive(Queryable, AsChangeset, Identifiable, Serialize, Deserialize, Debug)]
#[table_name = "content"]
#[changeset_options(treat_none_as_null="true")]
pub struct Content {
    id: i32,
    pub content_type: String,
    slug: String,
    title: String,
    content_desc: Option<String>,
    body: String,
    created_at: DateTime<Utc>,
    updated_at: DateTime<Utc>,
}

#[derive(Queryable, AsChangeset, Identifiable, Associations, Serialize, Deserialize, Debug)]
#[belongs_to(Content)]
#[table_name = "project"]
pub struct Project {
    id: i32,
    content_id: i32,
    current_status: String
}

#[derive(Queryable, AsChangeset, Identifiable, Associations, Serialize, Deserialize, Debug)]
#[belongs_to(Content)]
#[table_name = "blog"]
#[changeset_options(treat_none_as_null="true")]
pub struct Blog {
    id: i32,
    content_id: i32,
    tags: Option<Vec<String>>
}

#[derive(Serialize, Deserialize, Debug)]
pub struct FullContent {
    pub base_content: Content,
    pub extra_content: ExtraContent
}

// Structs for adding new content to db

#[derive(Insertable, Deserialize, Debug)]
#[table_name = "content"]
pub struct NewContent {
    content_type: String,
    slug: String,
    title: String,
    content_desc: Option<String>,
    body: String,
}


#[derive(Insertable, Deserialize, Debug)]
#[table_name = "project"]
pub struct NewProject {
    current_status: String,
}

#[derive(Insertable, Deserialize, Debug)]
#[table_name = "blog"]
pub struct NewBlog {
    tags: Option<Vec<String>>
}

#[derive(Deserialize, Debug)]
pub struct NewFullContent {
    pub new_base_content: NewContent,
    pub new_extra_content: NewExtraContent
}

#[cfg(test)]
mod tests {
    use super::*;

    // creates preset models be created for testing
    impl NewContent {
        pub fn new_with_blog_no_desc() -> NewContent {
            NewContent {
                content_type: "blog".to_string(),
                slug: "blog-test".to_string(),
                title: "Test Blog".to_string(),
                content_desc: None,
                body: "Hi".to_string()
            }
        }
        
        pub fn new_with_project_desc() -> NewContent {
            NewContent {
                content_type: "project".to_string(),
                slug: "project-test".to_string(),
                title: "Test Project".to_string(),
                content_desc: Some("this is one of the test projects".to_string()),
                body: "Hi".to_string()
            }
        }
        
        pub fn get_slug(&self) -> &str {
            &self.slug
        }
    }   
    
    impl NewBlog {
        pub fn new_without_tags() -> NewBlog {
            NewBlog {
                tags: None
            }
        }
    }
    
    impl NewProject {
        pub fn new_with_status() -> NewProject {
            NewProject {
                current_status: "finished".to_string()
            }
        }
    }
    
    impl FullContent {
        pub fn get_slug<'a>(&'a self) -> &'a str {
            &self.base_content.slug
        }
    }
}
use crate::schema::{blog, project};
use serde::{self, Deserialize, Serialize};

use super::base::Content;

/* -------------------------------------------------------------------------- */

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "lowercase")]
pub enum ExtraContent {
    Blog(Blog),
    Project(Project),
}

#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "lowercase")]
pub enum NewExtraContent {
    Blog(NewBlog),
    Project(NewProject),
}
/* -------------------------------------------------------------------------- */

#[derive(Queryable, AsChangeset, Identifiable, Associations, Serialize, Deserialize, Debug)]
#[diesel(table_name = project, belongs_to(Content, foreign_key = id ))]
pub struct Project {
    id: i32,
    content_type: String,
    current_status: String,
}

#[derive(Queryable, AsChangeset, Identifiable, Associations, Serialize, Deserialize, Debug)]
#[diesel(treat_none_as_null = true, table_name = blog, belongs_to(Content, foreign_key = id ))]
pub struct Blog {
    id: i32,
    content_type: String,
    tags: Option<Vec<Option<String>>>,
}

#[derive(Insertable, Deserialize, Serialize, Debug)]
#[diesel(table_name = project)]
pub struct NewProject {
    pub current_status: String,
}

#[derive(Insertable, Deserialize, Serialize, Debug)]
#[diesel(table_name = blog)]
pub struct NewBlog {
    tags: Option<Vec<String>>,
}
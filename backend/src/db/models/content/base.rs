use super::ContentType;
use crate::schema::{content};
use serde::{self, Deserialize, Serialize};
use chrono::{DateTime, Utc};

//TODO make a model that is changeable that dont have
// times or id and are all option feilds
#[derive(Queryable, AsChangeset, Identifiable, Serialize, Deserialize, Debug)]
#[diesel(table_name = content)]
#[diesel(treat_none_as_null = true)]
pub struct Content {
    id: i32,
    content_type: ContentType,
    slug: String,
    title: String,
    content_desc: Option<String>,
    body: String,
    created_at: DateTime<Utc>,
    updated_at: DateTime<Utc>,
}

#[derive(Insertable, Deserialize, Serialize, Debug)]
#[diesel(table_name = content)]
pub struct NewContent {
    content_type: ContentType,
    slug: String,
    title: String,
    content_desc: Option<String>,
    body: String,
}
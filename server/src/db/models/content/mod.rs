use super::deserialize_helpers;
use crate::schema::sql_types;
use diesel::{
    deserialize::{self, FromSql, FromSqlRow},
    expression::AsExpression,
    pg::{Pg, PgValue},
    serialize::{self, IsNull, Output, ToSql},
};
use serde::{self, Deserialize, Serialize};
use std::io::Write;
use validator::Validate;

/* -------------------------------------------------------------------------- */

pub mod base;
pub mod extra;
pub mod ops;

/* ----------------- Models for a complete piece of content ----------------- */
// Used to combine the base values for a peice
// of content with the data specific to the type of content
//
#[derive(Serialize, Deserialize, Validate, Debug)]
pub struct FullContent {
    #[validate]
    pub base_content: base::Content,
    #[validate]
    pub extra_content: extra::ExtraContent,
}

#[derive(Serialize, Deserialize, Validate, Debug)]
pub struct NewFullContent {
    #[validate]
    pub new_base_content: base::NewContent,
    #[validate]
    pub new_extra_content: extra::NewExtraContent,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct FullContentList {
    full_content_list: Vec<FullContent>,
    page_count: i64,
}

/* -------------------------------------------------------------------------- */

#[derive(Deserialize, Debug)]
pub struct ContentFilter {
    content_type: ContentType,
    project_status: Option<extra::CurrentStatus>,
    // Id for project to get blogs of
    project_blogs: Option<i32>,
    blog_tag: Option<String>,
    devblog_id: Option<i32>,
    search: Option<String>,
}

/* ---------------------------- Model data types ---------------------------- */
// Data types used by both base and extra content

// Represents the type of the content and therefore what extra
// content model it will be associated with
#[derive(Debug, Serialize, Deserialize, AsExpression, FromSqlRow)]
#[diesel(sql_type = sql_types::Contenttype)]
#[serde(rename_all = "lowercase")]
pub enum ContentType {
    Blog,
    Project,
}

// For convertion to and from sql types for ContentType
impl ToSql<sql_types::Contenttype, Pg> for ContentType {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
        match *self {
            ContentType::Blog => out.write_all(b"blog")?,
            ContentType::Project => out.write_all(b"project")?,
        }
        Ok(IsNull::No)
    }
}

impl FromSql<sql_types::Contenttype, Pg> for ContentType {
    fn from_sql(bytes: PgValue) -> deserialize::Result<Self> {
        match bytes.as_bytes() {
            b"blog" => Ok(ContentType::Blog),
            b"project" => Ok(ContentType::Project),
            _ => Err("Unrecognized enum variant".into()),
        }
    }
}

/* -------------------------------------------------------------------------- */
/*           Tests to generate random instances of the above structs          */
/* -------------------------------------------------------------------------- */

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json;

    #[test]
    #[ignore]
    fn print_json_content() {
        println!(
            "{}",
            serde_json::to_string(&NewFullContent::random_content()).unwrap()
        );
    }

    impl NewFullContent {
        pub fn random_content() -> NewFullContent {
            let (new_extra_content, content_type) = extra::tests::random_extra();
            let new_base_content = base::NewContent::random(content_type);

            NewFullContent {
                new_base_content,
                new_extra_content,
            }
        }
    }

    impl FullContentList {
        pub fn get_list(&self) -> &Vec<FullContent> {
            &self.full_content_list
        }
    }
}

use super::deserialize_helpers::empty_string_as_none;
use super::{base::Content, ContentType};
use crate::schema::{blog, devblog, project, sql_types, tag};
use chrono::{self, DateTime, Utc};
use diesel::{
    deserialize::{self, FromSql, FromSqlRow},
    expression::AsExpression,
    pg::{Pg, PgValue},
    serialize::{self, IsNull, Output, ToSql},
};
use serde::{self, Deserialize, Serialize};
use std::io::Write;
use validator::Validate;

/* -------------------------- Extra content stores -------------------------- */
// Used to store any piece of extra content under
// one type

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "lowercase")]
pub enum ExtraContent {
    Blog(Blog),
    Project(Project),
}

impl Validate for ExtraContent {
    fn validate(&self) -> Result<(), validator::ValidationErrors> {
        match self {
            ExtraContent::Blog(blog_data) => blog_data.validate(),
            ExtraContent::Project(project_data) => project_data.validate(),
        }
    }
}

#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "lowercase")]
pub enum NewExtraContent {
    Blog(NewBlog),
    Project(NewProject),
}

impl Validate for NewExtraContent {
    fn validate(&self) -> Result<(), validator::ValidationErrors> {
        match self {
            NewExtraContent::Blog(new_blog_data) => new_blog_data.validate(),
            NewExtraContent::Project(new_project_data) => new_project_data.validate(),
        }
    }
}

/* -------------------------- Extra content models -------------------------- */
// Models for different types of content that connect
// with other details in the content table to make
// a complete piece of content

#[derive(Insertable, Deserialize, Serialize, Validate, Debug)]
#[diesel(table_name = blog)]
pub struct NewBlog {
    related_project_id: Option<i32>,
    devblog_id: Option<i32>,
}

#[derive(
    Queryable, AsChangeset, Identifiable, Associations, Serialize, Deserialize, Validate, Debug,
)]
#[diesel(table_name = blog, treat_none_as_null = true, belongs_to(Content, foreign_key = id ), belongs_to(Project, foreign_key = related_project_id), belongs_to(Devblog, foreign_key = devblog_id))]
pub struct Blog {
    id: i32,
    content_type: ContentType,
    related_project_id: Option<i32>,
    devblog_id: Option<i32>,
}

#[derive(Insertable, Deserialize, Serialize, Validate, Debug)]
#[diesel(table_name = project)]
pub struct NewProject {
    current_status: CurrentStatus,
    #[serde(default, deserialize_with = "empty_string_as_none")]
    repository_url: Option<String>,
    #[serde(default, deserialize_with = "empty_string_as_none")]
    website_url: Option<String>,
    start_date: Option<DateTime<Utc>>,
}

#[derive(
    Queryable, AsChangeset, Identifiable, Associations, Serialize, Deserialize, Validate, Debug,
)]
#[diesel(table_name = project, treat_none_as_null = true, belongs_to(Content, foreign_key = id))]
pub struct Project {
    id: i32,
    current_status: CurrentStatus,
    content_type: ContentType,
    #[serde(default, deserialize_with = "empty_string_as_none")]
    repository_url: Option<String>,
    #[serde(default, deserialize_with = "empty_string_as_none")]
    website_url: Option<String>,
    start_date: Option<DateTime<Utc>>,
}

impl Blog {
    pub fn get_id(&self) -> i32 {
        self.id
    }
}

impl Project {
    pub fn get_id(&self) -> i32 {
        self.id
    }
}

/* --------------------------- Content extensions -------------------------- */
// Extra details the connect with piece of content

// No NewTag structure because its a simple data type that is unlikely to change
// and it made adding multiple tags easier I do recognize the inconsistency
#[derive(Queryable, Identifiable, Serialize, Deserialize, Debug)]
#[diesel(table_name = tag, belongs_to(Blog, foreign_key = blog_id ))]
pub struct Tag {
    id: i32,
    blog_id: i32,
    title: String,
}

impl Tag {
    pub fn get_title(self) -> String {
        self.title
    }
}

#[derive(Insertable, Serialize, Deserialize, Validate, Debug)]
#[diesel(table_name = devblog)]
pub struct NewDevblog {
    #[validate(length(min = 1))]
    title: String,
}

#[derive(Queryable, AsChangeset, Identifiable, Serialize, Deserialize, Validate, Debug)]
#[diesel(table_name = devblog)]
pub struct Devblog {
    id: i32,
    #[validate(length(min = 1))]
    title: String,
}

impl Devblog {
    pub fn get_id(&self) -> i32 {
        self.id
    }
}

/* ---------------------------- Models data types --------------------------- */
// Data that is used in a db model

// Represents the current status of a project
#[derive(Debug, Serialize, Deserialize, AsExpression, FromSqlRow, QueryId)]
#[diesel(sql_type = sql_types::Projectstatus)]
#[serde(rename_all = "snake_case")]
pub enum CurrentStatus {
    UnderDevelopment,
    Finished,
}

// For conversion to and from sql types for CurrentStatus
impl ToSql<sql_types::Projectstatus, Pg> for CurrentStatus {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
        match *self {
            CurrentStatus::Finished => out.write_all(b"finished")?,
            CurrentStatus::UnderDevelopment => out.write_all(b"under_development")?,
        }
        Ok(IsNull::No)
    }
}

impl FromSql<sql_types::Projectstatus, Pg> for CurrentStatus {
    fn from_sql(bytes: PgValue) -> deserialize::Result<Self> {
        match bytes.as_bytes() {
            b"finished" => Ok(CurrentStatus::Finished),
            b"under_development" => Ok(CurrentStatus::UnderDevelopment),
            _ => Err("Unrecognized enum variant".into()),
        }
    }
}

/* ---------------------- Extra content auto generation --------------------- */

#[cfg(test)]
pub mod tests {

    use super::*;
    use chrono::TimeZone;
    use rand::Rng;

    pub fn random_extra() -> (NewExtraContent, ContentType) {
        // project = 0, blog = 1
        let mut rng = rand::thread_rng();
        let extra_type = rng.gen_range(0..2);
        // Picks a random type of extra content and creates an instance of its
        // new model with random data
        match extra_type {
            0 => (
                NewExtraContent::Project(NewProject::random()),
                ContentType::Project,
            ),
            _ => (NewExtraContent::Blog(NewBlog::random()), ContentType::Blog),
        }
    }

    impl NewProject {
        // Generates an instance of NewProject with random values
        pub fn random() -> NewProject {
            let mut rng = rand::thread_rng();

            let current_status = {
                // 1/16 chance of project being finished
                if rng.gen_range(0..16) > 0 {
                    CurrentStatus::Finished
                } else {
                    CurrentStatus::UnderDevelopment
                }
            };

            let github_link = {
                // 1/2 chance of having github link
                if rng.gen_range(0..1) > 0 {
                    Some(String::from("https://github.com/ky-42/personal-site"))
                } else {
                    None
                }
            };

            let url = {
                // 1/2 chance of having a url
                if rng.gen_range(0..1) > 0 {
                    Some(String::from("https://kyledenief.me/"))
                } else {
                    None
                }
            };

            let start_date = {
                // 1/2 chance of having a start date
                if rng.gen_range(0..1) > 0 {
                    Some(Utc.with_ymd_and_hms(2023, 3, 14, 14, 40, 20).unwrap())
                } else {
                    None
                }
            };

            NewProject {
                current_status,
                repository_url: github_link,
                website_url: url,
                start_date,
            }
        }
    }

    impl NewBlog {
        // Generates an instance of NewBlog with random values
        pub fn random() -> NewBlog {
            NewBlog {
                related_project_id: None,
                devblog_id: None,
            }
        }
    }
}

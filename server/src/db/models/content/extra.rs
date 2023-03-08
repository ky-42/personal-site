use super::{ContentType, base::Content, deserialize_helpers::empty_vec_as_none};
use crate::schema::{blog, project, sql_types};
use diesel::{expression::AsExpression, pg::{Pg, PgValue}, serialize::{self, ToSql, Output, IsNull}, deserialize::{self, FromSql, FromSqlRow}};
use serde::{self, Deserialize, Serialize};
use std::io::Write;
use validator::Validate;

/* -------------------------- Extra content stores -------------------------- */
// Used to store any peice of extra content under
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
// Models for differnt types of content that connect
// with other details in the content table to make
// a complete peice of content


#[derive(Insertable, Deserialize, Serialize, Validate, Debug)]
#[diesel(table_name = blog)]
pub struct NewBlog {
    #[serde(deserialize_with = "empty_vec_as_none")]
    tags: Option<Vec<String>>,
}

#[derive(Queryable, AsChangeset, Identifiable, Associations, Serialize, Deserialize, Validate, Debug)]
#[diesel(table_name = blog, treat_none_as_null = true, belongs_to(Content, foreign_key = id ))]
pub struct Blog {
    id: i32,
    #[serde(deserialize_with = "empty_vec_as_none")]
    tags: Option<Vec<Option<String>>>,
    content_type: ContentType,
}

#[derive(Insertable, Deserialize, Serialize, Validate, Debug)]
#[diesel(table_name = project)]
pub struct NewProject {
    current_status: CurrentStatus,
}

#[derive(Queryable, AsChangeset, Identifiable, Associations, Serialize, Deserialize, Validate, Debug)]
#[diesel(table_name = project, belongs_to(Content, foreign_key = id ))]
pub struct Project {
    id: i32,
    current_status: CurrentStatus,
    content_type: ContentType,
}

/* ---------------------------- Models data types --------------------------- */

// Represtent the current status of a project
#[derive(Debug, Serialize, Deserialize, AsExpression, FromSqlRow, QueryId)]
#[diesel(sql_type = sql_types::Projectstatus)]
#[serde(rename_all = "snake_case")]
pub enum CurrentStatus {
    UnderDevelopment,
    Finished
}

// For convertion to and from sql types for CurrentStatus
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
            _ => Err("Unrecognized enum variant".into())
        }
    }
}

/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */

#[cfg(test)]
pub mod tests {

    use super::*;
    // use lipsum::{lipsum, lipsum_title, lipsum_words};
    use rand::seq::SliceRandom;
    use rand::Rng;
    
    pub fn random_extra() -> (NewExtraContent, ContentType) {
        // project = 0, blog = 1
        let mut rng = rand::thread_rng();
        let extra_type = rng.gen_range(0..2);
        // Picks a random type of extra content and creates an instance of its
        // new model with random data
        match extra_type {
            0 => (NewExtraContent::Project(NewProject::random()), ContentType::Project),
            _ => (NewExtraContent::Blog(NewBlog::random()), ContentType::Blog)
        }
    }

    impl NewProject {
        // Generates an instance of NewProject with random values
        pub fn random() -> NewProject {

            let mut rng = rand::thread_rng();

            let current_status =  {
                // 1/16 chance of project being finished
                if rng.gen_range(0..16) > 0 {
                    CurrentStatus::Finished
                } else {
                    CurrentStatus::UnderDevelopment
                }  
            };

            NewProject {
                current_status
            }
        }
    }        
    
    impl NewBlog {
        // Generates an instance of NewBlog with random values
        pub fn random() -> NewBlog {

            let mut rng = rand::thread_rng();

            // 1/6 chance of even having tags
            let tags: Option<Vec<String>> = if rng.gen_range(0..6) > 0 {
                // Number of tags to add
                let num_tags = rng.gen_range(1..4);
                Some(
                    [
                        "Python",
                        "Javascript",
                        "Rust",
                        "Django",
                        "Tutorial",
                        "React",
                        "Flask",
                        "Actix",
                        "Discord.py",
                    ]
                    // Chooses random elements from list and convers them to strings
                    .choose_multiple(&mut rng, num_tags)
                    .cloned()
                    .collect::<Vec<&str>>()
                    .iter()
                    .map(|&s| s.into())
                    .collect(),
                )
            } else {
                None
            };

            NewBlog {
                tags
            }
        }
    }
}
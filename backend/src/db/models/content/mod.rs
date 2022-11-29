use crate::schema::sql_types;
use serde::{self, Deserialize, Serialize};
use diesel::{expression::AsExpression, pg::{Pg, PgValue}, serialize::{self, ToSql, Output, IsNull}, deserialize::{self, FromSql, FromSqlRow}};
use std::io::Write;

/* -------------------------------------------------------------------------- */

pub mod base;
pub mod extra;
pub mod ops;

/* ----------------- Models for a complete piece of content ----------------- */
// Used to combine the base values for a peice
// of content with the specific values of the type
// of the piece of content (The extra content)

#[derive(Serialize, Deserialize, Debug)]
pub struct FullContent {
    pub base_content: base::Content,
    pub extra_content: extra::ExtraContent,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct NewFullContent {
    pub new_base_content: base::NewContent,
    pub new_extra_content: extra::NewExtraContent,
} 

/* ---------------------------- Models data types --------------------------- */
// Data types used by both base and extra content

// Represents the type of the content and therefore what extra
// content model it will be associated with
#[derive(Debug, Serialize, Deserialize, AsExpression, FromSqlRow)]
#[diesel(sql_type = sql_types::Contenttype)]
pub enum ContentType {
    Blog,
    Project
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
            _ => Err("Unrecognized enum variant".into())
        }
    }
}

/* -------------------------------------------------------------------------- */
/*           Tests to generate random instances of the above structs          */
/* -------------------------------------------------------------------------- */

#[cfg(test)]
mod tests {
    use super::*;
    use lipsum::{lipsum, lipsum_title, lipsum_words};
    use rand::Rng;
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
            let mut rng = rand::thread_rng();
            let title = lipsum_title();
            let slug = String::from(str::replace(&title, " ", "-")).to_lowercase();
            // 1/5 chance of of not having a description
            let content_desc: Option<String> = if rng.gen_range(0..5) > 0 {
                Some(lipsum_words(rng.gen_range(7..15)))
            } else {
                None
            };
            let body = lipsum(rng.gen_range(100..500));
            
            let (new_extra_content, content_type) = extra::tests::random_extra(rng);
            
            NewFullContent {
                new_base_content: base::NewContent {
                    content_type,
                    slug,
                    title,
                    content_desc,
                    body,
                },
                new_extra_content,
            }
        }
    }
}

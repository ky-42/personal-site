use std::io::Write;
use serde::{self, Deserialize, Serialize};
use diesel::{expression::AsExpression, deserialize::{self, FromSql}, pg::{self, Pg, PgValue}, serialize::{self, ToSql, Output}};

pub mod base;
pub mod extra;

#[derive(Debug, Serialize, Deserialize, AsExpression)]
#[diesel(sql_type = String)]
#[diesel(not_sized)]
#[serde(rename_all = "lowercase")]
pub enum ContentType {
    Blog,
    Project,
}

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

/* ----------- Convert content type to and from an Postgres string ---------- */

impl ToSql<String, Pg> for ContentType {
    fn to_sql<W: Write>(&self, out: &mut Output<Pg>) -> serialize::Result {
        match *self {
            ContentType::Blog => String::from("blog").to_sql(out),
            ContentType::Project => String::from("project").to_sql(out)
        }
    }
}

impl FromSql<String, Pg> for ContentType {
    fn from_sql(bytes: Option<PgValue<'_>>) -> deserialize::Result<Self> {
        match bytes?.as_bytes() {
            b"project" => Ok(ContentType::Project),
            b"blog" => Ok(ContentType::Blog),
            x => Err(format!("Unrecognized variant {}", String::fromSql(x)).into()),
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
    use rand::seq::SliceRandom;
    use rand::Rng;
    use serde_json;
    
    // Todo fux lipsum cause it keeps generating the same slugs 

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

            // project = 0, blog = 1
            let extra_type = rng.gen_range(0..2);
            let (new_extra_content, content_type) = match extra_type {
                0 => (NewFullContent::random_project(rng), "project".to_owned()),
                1 => (NewFullContent::random_blog(rng), "blog".to_owned()),
                _ => (NewFullContent::random_blog(rng), "blog".to_owned())
            };

            let mut rng = rand::thread_rng();
            let title = lipsum_title();
            let slug = String::from(str::replace(&title, " ", "-")).to_lowercase();
            let content_desc: Option<String> = if rng.gen_range(0..5) > 0 {
                Some(lipsum_words(rng.gen_range(7..15)))
            } else {
                None
            };
            let body = lipsum(rng.gen_range(100..500));
            
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
        
        pub fn random_project(mut rng: rand::prelude::ThreadRng) -> extra::NewExtraContent {
            extra::NewExtraContent::Project(
                extra::NewProject {
                    current_status: if rng.gen_range(0..16) > 0 {
                        String::from("finished")
                    } else {
                        String::from("under_development")                        
                    }
                }
            )
        }

        pub fn random_blog(mut rng: rand::prelude::ThreadRng) -> extra::NewExtraContent {
            let tags: Option<Vec<String>> = if rng.gen_range(0..6) > 0 {
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
            extra::NewExtraContent::Blog(
                extra::NewBlog {
                    tags
                }
            )
        }
        
        pub fn get_slug(&self) -> &str {
            return &self.new_base_content.slug;
        }

        pub fn get_title(&self) -> &str {

            return &self.new_base_content.title;
        }

        pub fn get_body(&self) -> &str {

            return &self.new_base_content.body;
        }
    }
    
    impl FullContent {
        pub fn get_slug(&self) -> &str {
            return &self.base_content.slug;
        }

        pub fn get_title(&self) -> &str {

            return &self.base_content.title;
        }

        pub fn get_body(&self) -> &str {
            return &self.base_content.body;
        }
        
        pub fn set_slug(&mut self, slug: String) {
            self.base_content.slug = slug;
        }
    }
}

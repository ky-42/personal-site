mod content;

use crate::schema::{blog, content, project};
use chrono::{DateTime, Utc};
use serde::{self, Deserialize, Serialize};

// ######################################################################################################
// ------------------------------------------------------------------------------------------------------
// ######################################################################################################

// Info for getting a list of content

#[derive(Deserialize, Debug)]
pub enum ShowOrder {
    Newest,
    Oldest,
}

#[derive(Deserialize, Debug)]
pub struct PageInfo {
    pub content_per_page: i64,
    pub page: i64,
    pub show_order: ShowOrder,
    pub content_type: Option<ContentType>,
}

impl Default for PageInfo {
    fn default() -> PageInfo {
        PageInfo {
            content_per_page: 4,
            page: 1,
            show_order: ShowOrder::Newest,
            content_type: None,
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
    Project,
}

// Used to convert content type to a string to insert into db
impl From<ContentType> for String {
    fn from(content_type: ContentType) -> Self {
        match content_type {
            ContentType::Blog => "blog".to_owned(),
            ContentType::Project => "project".to_owned(),
        }
    }
}

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

// ######################################################################################################
// ------------------------------------------------------------------------------------------------------
// ######################################################################################################

/* -------------------------- Existing Data Structs ------------------------- */
// Structs for getting and updating data from db

/* -------------------------------------------------------------------------- */

/* ---------------------------- New Data Structs ---------------------------- */
// Structs for adding new content to db

/* -------------------------------------------------------------------------- */

#[derive(Deserialize, Serialize, Debug)]
pub struct DbRows {
    pub rows_effected: i32
}







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
                new_base_content: NewContent {
                    content_type,
                    slug,
                    title,
                    content_desc,
                    body,
                },
                new_extra_content,
            }
        }
        
        pub fn random_project(mut rng: rand::prelude::ThreadRng) -> NewExtraContent {
            NewExtraContent::Project(
                NewProject {
                    current_status: if rng.gen_range(0..16) > 0 {
                        String::from("finished")
                    } else {
                        String::from("under_development")                        
                    }
                }
            )
        }

        pub fn random_blog(mut rng: rand::prelude::ThreadRng) -> NewExtraContent {
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
            NewExtraContent::Blog(
                NewBlog {
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

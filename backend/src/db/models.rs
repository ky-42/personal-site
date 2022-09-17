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
    // most_popular,
    // least_popular,
    Search(String),
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
pub enum ExtraContent {
    Blog(Blog),
    Project(Project),
}

#[derive(Deserialize, Debug)]
pub enum NewExtraContent {
    Blog(NewBlog),
    Project(NewProject),
}

// ######################################################################################################
// ------------------------------------------------------------------------------------------------------
// ######################################################################################################

// Structs for getting and updating data from db

//TODO make a model that is changeable that dont have
// times or id and are all option feilds
#[derive(Queryable, AsChangeset, Identifiable, Serialize, Deserialize, Debug)]
#[table_name = "content"]
#[changeset_options(treat_none_as_null = "true")]
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
    current_status: String,
}

#[derive(Queryable, AsChangeset, Identifiable, Associations, Serialize, Deserialize, Debug)]
#[belongs_to(Content)]
#[table_name = "blog"]
#[changeset_options(treat_none_as_null = "true")]
pub struct Blog {
    id: i32,
    content_id: i32,
    tags: Option<Vec<String>>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct FullContent {
    pub base_content: Content,
    pub extra_content: ExtraContent,
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
    tags: Option<Vec<String>>,
}

#[derive(Deserialize, Debug)]
pub struct NewFullContent {
    pub new_base_content: NewContent,
    pub new_extra_content: NewExtraContent,
}

#[cfg(test)]
mod tests {
    use super::*;
    use lipsum::lipsum;
    use rand::seq::SliceRandom;
    use rand::Rng;

    impl NewFullContent {
        pub fn random_project() -> NewFullContent {
            let mut rng = rand::thread_rng();

            let title = lipsum(rng.gen_range(2..5));
            let slug = String::from(str::replace(&title, " ", "-"));
            let content_desc: Option<String> = if rng.gen_range(0..5) > 0 {
                Some(lipsum(rng.gen_range(7..15)))
            } else {
                None
            };
            let body = lipsum(rng.gen_range(100..500));

            NewFullContent {
                new_base_content: NewContent {
                    content_type: String::from("project"),
                    slug,
                    title,
                    content_desc,
                    body,
                },
                new_extra_content: NewExtraContent::Project(NewProject {
                    current_status: String::from(
                        ["finished", "ongoing"].choose(&mut rng).unwrap() as &str
                    ),
                }),
            }
        }

        pub fn random_blog() -> NewFullContent {
            // TODO maybe add to its own function
            let mut rng = rand::thread_rng();

            let title = lipsum(rng.gen_range(4..10));
            let slug = String::from(str::replace(&title, " ", "-"));
            let content_desc: Option<String> = if rng.gen_range(0..5) > 0 {
                Some(lipsum(rng.gen_range(7..15)))
            } else {
                None
            };
            let body = lipsum(rng.gen_range(100..500));

            let tags: Option<Vec<String>> = if rng.gen_range(0..6) > 0 {
                let num_tags = rng.gen_range(0..4);
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

            NewFullContent {
                new_base_content: NewContent {
                    content_type: String::from("blog"),
                    slug,
                    title,
                    content_desc,
                    body,
                },
                new_extra_content: NewExtraContent::Blog(NewBlog { tags }),
            }
        }

        pub fn get_slug(&self) -> &str {
            &self.new_base_content.slug
        }
    }
}

use super::ContentType;
use crate::schema::content;
use serde::{self, Deserialize, Serialize};
use chrono::{DateTime, Utc};


/* --------------------------- Base content models -------------------------- */

/*
Models for the content table
The content table sores values that all connent
will have no matter what type of content it is 
*/

#[derive(Insertable, Deserialize, Serialize, Debug)]
#[diesel(table_name = content)]
pub struct NewContent {
    content_type: ContentType,
    slug: String,
    title: String,
    content_desc: Option<String>,
    body: String,
}

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

/* -------------------------------------------------------------------------- */

impl Content {
    pub fn get_id(&self) -> i32 {
        self.id
    }
    
    pub fn get_content_type(&self) -> &super::ContentType {
        &self.content_type
    }
}

/* -------------------------------------------------------------------------- */

#[cfg(test)]
pub mod tests {
    
    use super::*;
    use lipsum::{lipsum, lipsum_title, lipsum_words};
    use rand::Rng;

    impl NewContent {
        // Generates an instance of NewContent with random values
        pub fn random(content_type: ContentType) -> Self {

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

            Self {
                content_type,
                slug,
                title,
                content_desc,
                body,
            }
        }
        
        pub fn get_slug(&self) -> &str {
            return &self.slug;
        }
    }

    impl Content {
        pub fn get_slug(&self) -> &str {
            return &self.slug;
        }
        
        pub fn set_slug(&mut self, slug: String) {
            self.slug = slug;
        }
    }
}

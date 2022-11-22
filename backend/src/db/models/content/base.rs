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


#[cfg(test)]
pub mod tests {
    
    use super::*;

    impl NewContent {
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

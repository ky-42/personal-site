use diesel::prelude::*;
use crate::db::models;

pub fn find_content_by_slug(
    slug: &str,
    conn: PgConnection,
) -> Result<models::Content, std::error::Error> {
    use crate::schema::content::dsl::*;
    let found_content = content
        .filter(slug.eq(slug))
        .first::<models::Content>(conn)
    Ok(found_content) 
}
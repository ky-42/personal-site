use diesel;
use diesel::prelude::*;
use crate::db::models;

pub fn view_content(
    db_conn: &PgConnection,
    requested_slug: &str
) -> Result<models::FullContent, diesel::result::Error> {
    use crate::schema::content::dsl::*;
    let result = content.filter(slug.eq(requested_slug))
        .first::<models::Content>(db_conn)?;
    return match result.content_type {
        models::ContentType::Blog => {
            let found_blog = models::Blog::belonging_to(&result)
                .first(db_conn)?;
            Ok(models::FullContent {
                base_content: result,
                extra_content: models::ExtraContent::Blog(found_blog),
            })
        },
        models::ContentType::Project => {
            let found_project = models::Project::belonging_to(&result)
                .first(db_conn)?;
            Ok(models::FullContent {
                base_content: result,
                extra_content: models::ExtraContent::Project(found_project),
            })
        }
    };
}
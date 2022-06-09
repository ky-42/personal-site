use diesel;
use diesel::prelude::*;
use crate::db::models;
use crate::handlers::errors::{
    ContentError
};

pub fn view_content(
    db_conn: &PgConnection,
    requested_slug: &str
) -> Result<models::FullContent, ContentError> {
    // Used to get a single peice of content
    use crate::schema::content::dsl::*;
    let base_content = content.filter(slug.eq(requested_slug))
        .first::<models::Content>(db_conn)?;
    get_extra_content(
        db_conn,
        base_content
    )
}

pub fn view_recent_content(
    db_conn: &PgConnection,
    requested_content_type: models::ContentType,
    amount_to_view: i64
) -> Result<Vec<models::FullContent>, ContentError> {
    use crate::schema::content::dsl::*;
    let requested_content_type: String = requested_content_type.into();
    let base_content_list = content
        .filter(content_type.eq(requested_content_type))
        .order(created_at.desc())
        .limit(amount_to_view)
        .load::<models::Content>(db_conn)?;
    let mut full_content_list: Vec<models::FullContent> = Vec::new();
    for base_content in base_content_list{
        full_content_list.push(
            get_extra_content(
                db_conn,
                base_content
            )?
        );
    };
    Ok(full_content_list)
}

fn get_extra_content(
    db_conn: &PgConnection,
    base_content: models::Content,
) -> Result<models::FullContent, ContentError> {
    match base_content.content_type {
        models::ContentType::Blog => {
            let found_blog = models::Blog::belonging_to(&base_content)
                .first(db_conn)?;
            Ok(models::FullContent {
                base_content,
                extra_content: models::ExtraContent::Blog(found_blog),
            })
        },
        models::ContentType::Project => {
            let found_project = models::Project::belonging_to(&base_content)
                .first(db_conn)?;
            Ok(models::FullContent {
                base_content,
                extra_content: models::ExtraContent::Project(found_project),
            })
        }
    }
}

pub fn delete_content(
    db_conn: &PgConnection,
    delete_slug: String
) -> Result<usize, ContentError> {
    // Reutrns number of rows effected
    use crate::schema::content::dsl::*;
    Ok(diesel::delete(
        content.filter(slug.eq(delete_slug))
    ).execute(db_conn)?)
}

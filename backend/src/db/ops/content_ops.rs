use crate::handlers::{errors::AppError, route_data::PageInfo};
use diesel::{
    prelude::*,
    insert_into
};

pub fn read_content(
    db_conn: &mut PgConnection,
    requested_slug: &str,
) -> Result<models::FullContent, AppError> {
}

pub fn read_content_list(
    db_conn: &mut PgConnection,
    view_info: models::PageInfo,
) -> Result<Vec<models::FullContent>, AppError> {
}

pub fn delete_content(
    db_conn: &mut PgConnection,
    delete_slug: String,
) -> Result<usize, AppError> {
    // Reutrns number of rows effected
    use crate::schema::content::dsl::*;
    // Extra content should casscade delete
    Ok(diesel::delete(content.filter(slug.eq(delete_slug))).execute(db_conn)?)
}


pub fn update_content(
    db_conn: &mut PgConnection,
    update_data: models::FullContent,
) -> Result<models::FullContent, AppError> {
}

// Gets count of a spcific content type
pub fn content_count(
    db_conn: &mut PgConnection,
    type_to_count: models::ContentType
) -> Result<i64, AppError> {
}

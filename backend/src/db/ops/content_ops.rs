use crate::db::models;
use crate::handlers::errors::ContentError;
use diesel;
use diesel::insert_into;
use diesel::prelude::*;

pub fn view_content(
    db_conn: &mut PgConnection,
    requested_slug: &str,
) -> Result<models::FullContent, ContentError> {
    // Used to get a single peice of content
    use crate::schema::content::dsl::*;
    let base_content = content
        .filter(slug.eq(requested_slug))
        .first::<models::Content>(db_conn)?;
    get_extra_content(db_conn, base_content)
}

pub fn view_content_list(
    db_conn: &mut PgConnection,
    view_info: models::PageInfo,
) -> Result<Vec<models::FullContent>, ContentError> {
    use crate::schema::content::dsl::*;
    let mut base_content_query = content
        .into_boxed()
        .limit(view_info.content_per_page)
        .offset(view_info.content_per_page * view_info.page - 1);
    if let Some(requested_content_type) = view_info.content_type {
        base_content_query =
            base_content_query.filter(content_type.eq::<String>(requested_content_type.into()));
    };
    base_content_query = match view_info.show_order {
        models::ShowOrder::Newest => base_content_query.order(created_at.desc()),
        models::ShowOrder::Oldest => base_content_query.order(created_at.asc()),
        models::ShowOrder::Search(_search_term) => base_content_query,
        // models::ShowOrder::most_popular => {}
        // models::ShowOrder::least_popular => {}
    };
    let base_content_results = base_content_query.load::<models::Content>(db_conn)?;

    let mut full_content_list = vec![];

    for base_content in base_content_results {
        full_content_list.push(get_extra_content(db_conn, base_content)?);
    }
    Ok(full_content_list)
}

fn get_extra_content(
    db_conn: &mut PgConnection,
    base_content: models::Content,
) -> Result<models::FullContent, ContentError> {
    match &base_content.content_type[..] {
        // Gets extra content then creates full content to return
        "blog" => {
            let found_blog = models::Blog::belonging_to(&base_content).first(db_conn)?;
            Ok(models::FullContent {
                base_content,
                extra_content: models::ExtraContent::Blog(found_blog),
            })
        }
        "project" => {
            let found_project = models::Project::belonging_to(&base_content).first(db_conn)?;
            Ok(models::FullContent {
                base_content,
                extra_content: models::ExtraContent::Project(found_project),
            })
        }
        _ => {
            // TODO add another error for this specifically
            Err(ContentError::ContentNotFound)
        }
    }
}

pub fn delete_content(
    db_conn: &mut PgConnection,
    delete_slug: String,
) -> Result<usize, ContentError> {
    // Reutrns number of rows effected
    use crate::schema::content::dsl::*;
    Ok(diesel::delete(content.filter(slug.eq(delete_slug))).execute(db_conn)?)
}

pub fn add_content(
    db_conn: &mut PgConnection,
    add_data: models::NewFullContent,
) -> Result<(), ContentError> {
    use crate::schema::content;
    // Adds base content and gets new id
    let base_content_id: i32 = insert_into(content::table)
        .values(add_data.new_base_content)
        .returning(content::id)
        .get_result(db_conn)?;
    match add_data.new_extra_content {
        // Adds extra content and adds id of base content
        models::NewExtraContent::Blog(extra_content) => {
            use crate::schema::blog;
            insert_into(blog::table)
                .values((blog::content_id.eq(base_content_id), &extra_content))
                .execute(db_conn)?;
        }
        models::NewExtraContent::Project(extra_content) => {
            use crate::schema::project;
            insert_into(project::table)
                .values((project::content_id.eq(base_content_id), &extra_content))
                .execute(db_conn)?;
        }
    };
    Ok(())
}

pub fn update_content(
    db_conn: &mut PgConnection,
    update_data: models::FullContent,
) -> Result<(), ContentError> {
    let _base_update: models::Content = update_data.base_content.save_changes(db_conn)?;
    let _extra_update = match update_data.extra_content {
        models::ExtraContent::Blog(blog_update_data) => {
            models::ExtraContent::Blog(blog_update_data.save_changes(db_conn)?)
        }
        models::ExtraContent::Project(project_update_data) => {
            models::ExtraContent::Project(project_update_data.save_changes(db_conn)?)
        }
    };
    Ok(())
}

// #[cfg(test)]
// mod tests {
//     use super::*;
//     use crate::test_helpers;

//     #[test]
//     fn basic_content_tests() {
//         let basic_content = models::NewFullContent {
//             new_base_content: models::NewContent::new_with_blog_no_desc(),
//             new_extra_content: models::NewExtraContent::Blog(models::NewBlog::new_without_tags()),
//         };
//         let conn = test_helpers::db_connection();

//         let slug = basic_content.new_base_content.get_slug().to_string();

//         // Tests adding basic content
//         let add_content_result = add_content(&conn, basic_content).expect("Could not add content");
//         assert_eq!((), add_content_result);

//         // Tests getting some content
//         let retreived_content = view_content(&conn, &slug).expect("Error getting content");
//         assert_eq!(slug, retreived_content.get_slug());

//         let rows_deleted = delete_content(&conn, retreived_content.get_slug().to_string())
//             .expect("Could not delete content");
//         assert_eq!(rows_deleted, 1);
//     }
// }

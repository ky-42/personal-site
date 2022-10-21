use crate::db::models;
use crate::handlers::errors::ContentError;
use diesel;
use diesel::insert_into;
use diesel::prelude::*;

pub fn view_under_dev_projects(
    db_conn: &mut PgConnection
) -> Result<Vec<models::FullContent>, ContentError> {
    use crate::schema::{content, project};
    let project_results = content::table
        .inner_join(project::table)
        .order_by(content::columns::created_at.desc())
        .filter(project::columns::current_status.eq("under_development"))
        .load::<(models::Content, models::Project)>(db_conn)?;
    
    let mut full_content_list = vec![];

    for project_content in project_results {
        full_content_list.push(models::FullContent{
            base_content: project_content.0,
            extra_content: models::ExtraContent::Project(project_content.1)
        });
    }

    Ok(full_content_list)
}

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
    use crate::schema::{content, project, blog};

    let base_content_query = content::table
        .limit(view_info.content_per_page)
        .offset(view_info.content_per_page * view_info.page)
        .order_by(content::columns::created_at.desc());

    let mut full_content_list = vec![];

    match view_info.content_type {
        Some(content_type) => {
            match content_type {
                models::ContentType::Project => {
                    let project_results = base_content_query 
                        .inner_join(project::table)
                        .filter(project::columns::current_status.eq("finished"))
                        .load::<(models::Content, models::Project)>(db_conn)?;
                    for project_content in project_results {
                        full_content_list.push(models::FullContent{
                            base_content: project_content.0,
                            extra_content: models::ExtraContent::Project(project_content.1)
                        });
                    }
                },
                models::ContentType::Blog => {
                    let blog_results = base_content_query
                        .inner_join(blog::table)
                        .load::<(models::Content, models::Blog)>(db_conn)?;
                    for blog_content in blog_results {
                        full_content_list.push(models::FullContent{
                            base_content: blog_content.0,
                            extra_content: models::ExtraContent::Blog(blog_content.1)
                        });
                    }
                }
            }
        },
        None => {
            let base_content_results = base_content_query.load::<models::Content>(db_conn)?;

            for base_content in base_content_results {
                full_content_list.push(get_extra_content(db_conn, base_content)?);
            }
        }
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

pub fn content_count(
    db_conn: &mut PgConnection,
    type_to_count: models::ContentType
) -> Result<i64, ContentError> {
    match type_to_count {
        models::ContentType::Blog => {
            use crate::schema::blog;
            let count = blog::table
                .count()
                .get_result(db_conn)?;
            Ok(count)
        }
        models::ContentType::Project => {
            use crate::schema::project;
            let count = project::table
                .count()
                .get_result(db_conn)?;
            Ok(count)
        }
    }
}

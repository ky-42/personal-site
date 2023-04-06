use super::{errors::AppError, extractors::AuthUser, route_data::*};
use crate::db::{models::content::{ FullContent, NewFullContent, FullContentList, ContentFilter, extra::{Tag, Devblog, NewDevblog}, ops::devblog_ops::DevblogString}, DbPool};
use actix_web::{web, HttpResponse};
use validator::Validate;

/* -------------------------------------------------------------------------- */
/*                                 Responders                                 */
/* -------------------------------------------------------------------------- */

// Returns a list of content including its extra content
// For projects only returns finished projects
pub async fn list_content(
    db_pool: web::Data<DbPool>,
    page_info: web::Query<PageInfo>,
    query_filters: web::Query<ContentFilter>
) -> Result<web::Json<FullContentList>, AppError> {
    let fetched_content_list: FullContentList = web::block(move || {
        let mut db_conn = db_pool.get()?;
        FullContentList::list(
            page_info.into_inner(),
            query_filters.into_inner(),
            &mut db_conn
        )
    })
    .await??;

    Ok(web::Json(fetched_content_list))
}

/* ----------------------- CRUD routes for content ----------------------- */

// Returns a single peice of content
pub async fn view_content(
    db_pool: web::Data<DbPool>,
    slug_requested: web::Path<ContentSlug>
) -> Result<web::Json<FullContent>, AppError> {
    let fetched_content: FullContent = web::block(move || {
        let mut db_conn = db_pool.get()?;
        FullContent::view(
            slug_requested.into_inner().slug,
            &mut db_conn
        )
    })
    .await??;

    Ok(web::Json(fetched_content))
}

// Gets a peice of content given id instead of slug
pub async fn view_from_id(
    db_pool: web::Data<DbPool>,
    content_id: web::Path<IdStruct>,
) -> Result<web::Json<FullContent>, AppError> {
    let fetched_content: FullContent = web::block(move || {
        let mut db_conn = db_pool.get()?;
        
        FullContent::view(
            FullContent::id_to_slug(
                content_id.into_inner().id,
                &mut db_conn
            )?, &mut db_conn
        )
    })
    .await??;

    Ok(web::Json(fetched_content))
}

// Updates a peice of content given a full content object then includes all values
// not just the updated properties 
pub async fn update_content(
    db_pool: web::Data<DbPool>,
    _old_slug: web::Path<ContentSlug>,
    update_info: web::Json<FullContent>,
    _: AuthUser
) -> Result<HttpResponse, AppError> {
    let mut update_data = update_info.into_inner();
    update_data.validate()?;
    // Sets new edit date
    update_data.base_content.update_edit_at();
    web::block(move || {
        let mut db_conn = db_pool.get()?;
        update_data.update(&mut db_conn)
    })
    .await??;

    Ok(HttpResponse::Ok().finish())
}

// Deletes a peice of content given the slug
pub async fn delete_content(
    db_pool: web::Data<DbPool>,
    delete_slug: web::Path<ContentSlug>,
    _: AuthUser
) -> Result<web::Json<DbRows>, AppError> {
    // Returns the number of rows deleted
    let rows_deleted = web::block(move || {
        let mut db_conn = db_pool.get()?;
        FullContent::delete(delete_slug.into_inner().slug, &mut db_conn)
    })
    .await?? as i32;

    Ok(web::Json(DbRows{
        rows_effected: rows_deleted
    }))
}

// Adds a peice of content given data for the new content
pub async fn add_content(
    db_pool: web::Data<DbPool>,
    add_info: web::Json<NewFullContent>,
    _: AuthUser
) -> Result<HttpResponse, AppError> {
    let add_data = add_info.into_inner();
    add_data.validate()?; 
    web::block(move || {
        let mut db_conn = db_pool.get()?;
        add_data.add(&mut db_conn)
    })
    .await??;

    Ok(HttpResponse::Ok().finish())
}

/* ---------------------------- Handlers for tags --------------------------- */

// Gets all tags assosicated with a blog
pub async fn get_tags(
    db_pool: web::Data<DbPool>,
    blog_slug: web::Path<ContentSlug>,
) -> Result<web::Json<Vec<Tag>>, AppError> {
    let fetched_content: Vec<Tag> = web::block(move || {
        let mut db_conn = db_pool.get()?;
        Tag::get_blogs_tags(
            FullContent::slug_to_id(
                &blog_slug.into_inner().slug,
                &mut db_conn
            )?,
            &mut db_conn
        )
    })
    .await??;

    Ok(web::Json(fetched_content))
}

// Adds list of tags to blog
pub async fn add_tags(
    db_pool: web::Data<DbPool>,
    blog_add_slug: web::Path<ContentSlug>,
    tags_list: web::Json<TagsToAdd>,
    _: AuthUser
) -> Result<HttpResponse, AppError> {
     web::block(move || {
        let mut db_conn = db_pool.get()?;
        Tag::add_tags(
            &tags_list.into_inner().tags,
            FullContent::slug_to_id(
                &blog_add_slug.into_inner().slug,
                &mut db_conn
            )?,
            &mut db_conn
        )
    })
    .await??;

    Ok(HttpResponse::Ok().finish())
}

// Deletes all tags associated with a blog
pub async fn delete_tags(
    db_pool: web::Data<DbPool>,
    blog_delete_slug: web::Path<ContentSlug>,
    _: AuthUser
) -> Result<web::Json<DbRows>, AppError> {
    // Returns the number of rows deleted
    let rows_deleted = web::block(move || {
        let mut db_conn = db_pool.get()?;
        Tag::remove_tags(
            FullContent::slug_to_id(
                &blog_delete_slug.into_inner().slug,
                &mut db_conn
            )?,
            &mut db_conn
        )
    })
    .await?? as i32;

    Ok(web::Json(DbRows{
        rows_effected: rows_deleted
    }))
}

/* -------------------------- Handlers for devblogs ------------------------- */

// Gets a devblog object
pub async fn get_devblog(
    db_pool: web::Data<DbPool>,
    devblog_title: web::Path<DevblogTitle>,
) -> Result<web::Json<Devblog>, AppError> {
    let fetched_devblog: Devblog = web::block(move || {
        let mut db_conn = db_pool.get()?;
        devblog_title.into_inner().title.get_devblog(
            &mut db_conn
        )
    })
    .await??;

    Ok(web::Json(fetched_devblog))
}

pub async fn get_devblog_from_id(
    db_pool: web::Data<DbPool>,
    devblog_id: web::Path<IdStruct>,
) -> Result<web::Json<Devblog>, AppError> {
    let fetched_devblog: Devblog = web::block(move || {
        let mut db_conn = db_pool.get()?;
        Devblog::get_devblog_from_id(
            devblog_id.into_inner().id,
            &mut db_conn
        )
    })
    .await??;

    Ok(web::Json(fetched_devblog))
}

// Given a blog gets next and previous blogs in devlog
pub async fn get_surrounding_blogs(
    db_pool: web::Data<DbPool>,
    surrounding_data: web::Query<GetSurroundingData>,
) -> Result<web::Json<SurroundingBlogs>, AppError> {
    let request_data = surrounding_data.into_inner();

    Ok(web::Json(web::block(move || {
        let mut db_conn = db_pool.get()?;
        Devblog::get_surrounding_blogs(
            request_data.devblog_id,
            request_data.blog_slug,
            request_data.direction_count,
            &mut db_conn
        )
    })
    .await??))
}

pub async fn add_devblog(
    db_pool: web::Data<DbPool>,
    add_info: web::Json<NewDevblog>,
    _: AuthUser
) -> Result<HttpResponse, AppError> {
    let add_data = add_info.into_inner();
    add_data.validate()?; 
    web::block(move || {
        let mut db_conn = db_pool.get()?;
        add_data.add(&mut db_conn)
    })
    .await??;

    Ok(HttpResponse::Ok().finish())
}

pub async fn update_devblog(
    db_pool: web::Data<DbPool>,
    _old_title: web::Path<DevblogTitle>,
    update_info: web::Json<Devblog>,
    _: AuthUser
) -> Result<HttpResponse, AppError> {
    let update_data = update_info.into_inner();
    update_data.validate()?;

    web::block(move || {
        let mut db_conn = db_pool.get()?;
        update_data.update(&mut db_conn)
    })
    .await??;

    Ok(HttpResponse::Ok().finish())
}

pub async fn delete_devblog(
    db_pool: web::Data<DbPool>,
    devblog_title: web::Path<DevblogTitle>,
    _: AuthUser
) -> Result<web::Json<DbRows>, AppError> {
    // Returns the number of rows deleted
    let rows_deleted = web::block(move || {
        let mut db_conn = db_pool.get()?;
        Devblog::delete(
            devblog_title.into_inner().title,
            &mut db_conn
        )
    })
    .await?? as i32;

    Ok(web::Json(DbRows{
        rows_effected: rows_deleted
    }))
}
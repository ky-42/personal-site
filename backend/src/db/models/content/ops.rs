use std::{vec, io::Read};

use actix_web::App;
use diesel::{
    prelude::*,
    insert_into,
};

use crate::{handlers::{errors::AppError, route_data}, db::models::content::FullContent};
use super::{base, extra};

impl super::NewFullContent {
    pub fn add(
        &self,
        db_conn: &mut PgConnection,
    ) -> Result<(), AppError> {
        use crate::schema::content;
        // Adds base content and gets new id
        let base_content_id: i32 = insert_into(content::table)
            .values(&self.new_base_content)
            .returning(content::id)
            .get_result(db_conn)?;

        // Adds extra content different add statment depending on content type
        match &self.new_extra_content {
            extra::NewExtraContent::Blog(new_blog_data) => {
                use crate::schema::blog;
                insert_into(blog::table)
                    .values((blog::id.eq(base_content_id), new_blog_data))
                    .execute(db_conn)?;
            }
            extra::NewExtraContent::Project(new_project_data) => {
                use crate::schema::project;
                insert_into(project::table)
                    .values((project::id.eq(base_content_id), new_project_data))
                    .execute(db_conn)?;
            }
        };
        Ok(())
    }
}

impl super::FullContent {

    pub fn update(
        self,
        db_conn: &mut PgConnection
    ) -> Result<(), AppError> {
        use extra::ExtraContent;
        self.base_content.save_changes::<base::Content>(db_conn)?;
        match self.extra_content {
            ExtraContent::Blog(updated) => {updated.save_changes::<extra::Blog>(db_conn)?;},
            ExtraContent::Project(updated) => {updated.save_changes::<extra::Project>(db_conn)?;}
        };
        Ok(())
    }
    
    pub fn delete(
        delete_slug: String,
        db_conn: &mut PgConnection
    ) -> Result<usize, AppError>{
        // Reutrns number of rows effected
        use crate::schema::content::dsl::*;
        // Extra content should casscade delete
        Ok(diesel::delete(content.filter(slug.eq(delete_slug))).execute(db_conn)?)
    } 

    pub fn view(
        view_slug: String,
        db_conn: &mut PgConnection
    ) -> Result<super::FullContent, AppError> {

        use crate::schema::content;
        let base_content: base::Content = content::table.filter(content::slug.eq(view_slug)).first(db_conn)?;

        let extra_content = match base_content.get_content_type() {
            super::ContentType::Blog => {
                use crate::schema::blog;
                extra::ExtraContent::Blog(
                    blog::table.filter(blog::id.eq(base_content.get_id()))
                        .first::<extra::Blog>(db_conn)?
                )
            },            
            super::ContentType::Project => {
                use crate::schema::project;
                extra::ExtraContent::Project(
                    project::table.filter(project::id.eq(base_content.get_id()))
                        .first::<extra::Project>(db_conn)?
                )
            },            
        };
        
        Ok(super::FullContent {
            base_content,
            extra_content
        })
    }
}

impl super::FullContentList {
    pub fn list(
        page_info: route_data::PageInfo,
        filters: super::ContentFilter,
        db_conn: &mut PgConnection
    ) -> Result<Self, AppError> {
        use crate::schema::content;
        match filters.content_type {
            super::ContentType::Blog => {
                use crate::schema::blog;

                let mut blog_list = content::table
                    .inner_join(blog::table.on(blog::id.eq(content::id)))
                    .filter(content::content_type.eq(super::ContentType::Blog))
                    .into_boxed();

                if let Some(tag) = &filters.blog_tag {
                    blog_list = blog_list.filter(blog::tags.contains(vec![tag]));
                };
                
                let count: i64 = Self::count(&filters, db_conn)?;
                
                let blog_list = blog_list
                    .limit(page_info.content_per_page)
                    .offset(page_info.page * page_info.content_per_page)
                    .order_by(content::created_at.desc());
            
                let list: Vec<(base::Content, extra::Blog)> = blog_list.load::<(base::Content, extra::Blog)>(db_conn)?;
                
                let mut full_content_list:Vec<FullContent> = Vec::new();

                for content_item in list {
                    full_content_list.push(
                        FullContent { base_content: content_item.0, extra_content: extra::ExtraContent::Blog(content_item.1) }
                    )
                }
                
                let max_page: i64 = (count as f64/page_info.content_per_page as f64).ceil() as i64;

                Ok(Self {
                    full_content_list,
                    max_page
                })
            },
            super::ContentType::Project => {
                use crate::schema::project;

                let mut project_list = content::table
                    .inner_join(project::table.on(project::id.eq(content::id)))
                    .filter(content::content_type.eq(super::ContentType::Project))
                    .into_boxed();

                if let Some(status) = &filters.project_status {
                    project_list = project_list.filter(project::current_status.eq(status));
                };
                
                let count: i64 = Self::count(&filters, db_conn)?;
                
                project_list = project_list
                    .limit(page_info.content_per_page)
                    .offset(page_info.page * page_info.content_per_page)
                    .order_by(content::created_at.desc());
            
                let list: Vec<(base::Content, extra::Project)> = project_list.load::<(base::Content, extra::Project)>(db_conn)?;
                
                let mut full_content_list:Vec<FullContent> = Vec::new();

                for content_item in list {
                    full_content_list.push(
                        FullContent { base_content: content_item.0, extra_content: extra::ExtraContent::Project(content_item.1) }
                    )
                }
                
                let max_page: i64 = (count as f64/page_info.content_per_page as f64).ceil() as i64;

                Ok(Self {
                    full_content_list,
                    max_page
                })
            }
        }
    }
    
    fn count(
        filters: &super::ContentFilter,
        db_conn: &mut PgConnection
    ) -> Result<i64, AppError> {
        use crate::schema::content;
        match filters.content_type {
            super::ContentType::Blog => {
                use crate::schema::blog;

                let mut blog_list = content::table
                    .inner_join(blog::table.on(blog::id.eq(content::id)))
                    .filter(content::content_type.eq(super::ContentType::Blog))
                    .into_boxed();

                if let Some(tag) = &filters.blog_tag {
                    blog_list = blog_list.filter(blog::tags.contains(vec![tag]));
                };
                
                Ok(blog_list.count().get_result(db_conn)?)
                
            },
            super::ContentType::Project => {
                use crate::schema::project;

                let mut project_list = content::table
                    .inner_join(project::table.on(project::id.eq(content::id)))
                    .filter(content::content_type.eq(super::ContentType::Project))
                    .into_boxed();

                if let Some(status) = &filters.project_status {
                    project_list = project_list.filter(project::current_status.eq(status));
                };
                
                Ok(project_list.count().get_result(db_conn)?)
            }
        }
    }
}
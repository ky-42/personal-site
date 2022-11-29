use actix_web::App;
use diesel::{
    prelude::*,
    insert_into,
    pg::{self, Pg}
};

use crate::{handlers::{errors::AppError, route_data}};
use super::{base, extra};

impl super::NewFullContent {
    pub fn add(
        &self,
        db_conn: &mut PgConnection,
    ) -> Result<(), AppError> {
        use crate::schema::content;
        // Adds base content and gets new id
        let base_content_id: i32 = insert_into(content::table)
            .values(self.new_base_content)
            .returning(content::id)
            .get_result(db_conn)?;

        // Adds extra content different add statment depending on content type
        match self.new_extra_content {
            extra::NewExtraContent::Blog(new_blog_data) => {
                use crate::schema::blog;
                insert_into(blog::table)
                    .values((blog::id.eq(base_content_id), &new_blog_data))
                    .execute(db_conn)?;
            }
            extra::NewExtraContent::Project(new_project_data) => {
                use crate::schema::project;
                insert_into(project::table)
                    .values((project::id.eq(base_content_id), &new_project_data))
                    .execute(db_conn)?;
            }
        };
        Ok(())
    }
}

impl super::FullContent {

    pub fn update(
        &self,
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
        let b: base::Content = content::table.filter(content::slug.eq(view_slug)).first(db_conn)?;
        
        Ok(super::FullContent {
            base_content: b,
            extra_content: match b.get_content_type() {
                super::ContentType::Blog => {
                    use crate::schema::blog;
                    extra::ExtraContent::Blog(
                        blog::table.filter(blog::id.eq(b.get_id()))
                            .first::<extra::Blog>(db_conn)?
                    )
                },            
                super::ContentType::Project => {
                    use crate::schema::project;
                    extra::ExtraContent::Project(
                        project::table.filter(project::id.eq(b.get_id()))
                            .first::<extra::Project>(db_conn)?
                    )
                },            
            }
        })
    }
    
    pub fn list(
        page_info: route_data::PageInfo,
        content_type: super::ContentType,
        db_conn: &mut PgConnection
    ) -> Result<Vec<super::FullContent>, AppError> {

    }
    
    pub fn count(
        content_type: super::ContentType,
        db_conn: &mut PgConnection
    ) -> Result<i64, AppError> {
        Ok(match content_type {
            super::ContentType::Blog => {
                use crate::schema::blog;
                blog::table
                    .count()
                    .get_result(db_conn)?
            },
            super::ContentType::Project => {
                use crate::schema::project;
                project::table
                    .filter(project::current_status.eq(extra::CurrentStatus::Finished))
                    .count()
                    .get_result(db_conn)?
            }
        })
    }
}
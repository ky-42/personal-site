use diesel::{
    prelude::*,
    insert_into,
};

use crate::{handlers::{errors::AppError, route_data::{self, ShowOrder}}, db::models::content::FullContent};
use super::{base, extra};

/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */

impl super::FullContent {

    pub fn update(
        self,
        db_conn: &mut PgConnection
    ) -> Result<(), AppError> {
        use extra::ExtraContent;
        
        // Update base content
        self.base_content.save_changes::<base::Content>(db_conn)?;

        // Update extra content
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

        // Extra content should casscade delete on deltetion of base content
        Ok(diesel::delete(content.filter(slug.eq(delete_slug))).execute(db_conn)?)
    } 

    pub fn view(
        view_slug: String,
        db_conn: &mut PgConnection
    ) -> Result<super::FullContent, AppError> {

        use crate::schema::content;

        // Runs query to get base content
        let base_content: base::Content = content::table.filter(content::slug.eq(view_slug)).first(db_conn)?;

        // Gets extra content
        let extra_content = match base_content.get_content_type() {
            super::ContentType::Blog => {

                use crate::schema::blog;

                // Runs query to get blog and puts it in the extra content enum
                extra::ExtraContent::Blog(
                    blog::table.filter(blog::id.eq(base_content.get_id()))
                        .first::<extra::Blog>(db_conn)?
                )
            },            
            super::ContentType::Project => {

                use crate::schema::project;

                // Runs query to get project and puts it in the extra content enum
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

/* -------------------------------------------------------------------------- */

impl super::FullContentList {
    pub fn list(
        page_info: route_data::PageInfo,
        filters: super::ContentFilter,
        db_conn: &mut PgConnection
    ) -> Result<Self, AppError> {
        
        // Returns a list of content and the count of that content
        // with filters applied

        use crate::schema::content;

        match filters.content_type {
            super::ContentType::Blog => {

                use crate::schema::blog;

                // Creates inital joined query with blog table and content table
                let mut blog_list = content::table
                    .inner_join(blog::table.on(blog::id.eq(content::id)))
                    .filter(content::content_type.eq(super::ContentType::Blog))
                    .into_boxed();

                // Filters by tag
                if let Some(tag) = &filters.blog_tag {
                    blog_list = blog_list.filter(blog::tags.contains(vec![tag]));
                };
                
                // Does paging of query
                blog_list = blog_list
                    .limit(page_info.content_per_page)
                    .offset(page_info.page * page_info.content_per_page);
                
                // Changes order of blogs returned
                blog_list = match page_info.show_order {
                    ShowOrder::Newest => blog_list.order_by(content::created_at.desc()),
                    ShowOrder::Oldest => blog_list.order_by(content::created_at.asc()),
                };
            
                // Runs query to get the list of blogs 
                let list: Vec<(base::Content, extra::Blog)> = blog_list.load::<(base::Content, extra::Blog)>(db_conn)?;
                
                // Combines the base content and the blog content into one stuct
                // and puts it in a list
                let mut full_content_list:Vec<FullContent> = Vec::new();

                for content_item in list {
                    full_content_list.push(
                        FullContent { base_content: content_item.0, extra_content: extra::ExtraContent::Blog(content_item.1) }
                    )
                }

                // Gets count of content with all filters
                // TODO make pagination extention like in disel docs
                let content_count: i64 = Self::count(&filters, db_conn)?;

                Ok(Self {
                    full_content_list,
                    content_count
                })
            },

            super::ContentType::Project => {

                use crate::schema::project;

                // Creates inital joined query with project table and content table
                let mut project_list = content::table
                    .inner_join(project::table.on(project::id.eq(content::id)))
                    .filter(content::content_type.eq(super::ContentType::Project))
                    .into_boxed();

                // Filters by project status
                if let Some(status) = &filters.project_status {
                    project_list = project_list.filter(project::current_status.eq(status));
                };
                
                // Changes order of project returned
                project_list = project_list
                    .limit(page_info.content_per_page)
                    .offset(page_info.page * page_info.content_per_page)
                    .order_by(content::created_at.desc());

                // Changes order of project returned
                project_list = match page_info.show_order {
                    ShowOrder::Newest => project_list.order_by(content::created_at.desc()),
                    ShowOrder::Oldest => project_list.order_by(content::created_at.asc()),
                };
            
                // Runs query to get the list of projects 
                let list: Vec<(base::Content, extra::Project)> = project_list.load::<(base::Content, extra::Project)>(db_conn)?;
                
                // Combines the base content and the project content into one stuct
                // and puts it in a list
                let mut full_content_list:Vec<FullContent> = Vec::new();

                for content_item in list {
                    full_content_list.push(
                        FullContent { base_content: content_item.0, extra_content: extra::ExtraContent::Project(content_item.1) }
                    )
                }
                
                // Gets count of content with all filters
                // TODO make pagination extention like in disel docs
                let content_count: i64 = Self::count(&filters, db_conn)?;
                
                Ok(Self {
                    full_content_list,
                    content_count
                })
            }
        }
    }
    
    fn count(
        filters: &super::ContentFilter,
        db_conn: &mut PgConnection
    ) -> Result<i64, AppError> {

        // Returns how many peice of contenter there are with filters

        use crate::schema::content;

        match filters.content_type {
            super::ContentType::Blog => {

                use crate::schema::blog;

                // Creates inital joined query with blog table and content table
                let mut blog_list = content::table
                    .inner_join(blog::table.on(blog::id.eq(content::id)))
                    .filter(content::content_type.eq(super::ContentType::Blog))
                    .into_boxed();

                // Filters by blog tag
                if let Some(tag) = &filters.blog_tag {
                    blog_list = blog_list.filter(blog::tags.contains(vec![tag]));
                };
                
                // Get and return the count of the query
                Ok(blog_list.count().get_result(db_conn)?)
                
            },

            super::ContentType::Project => {
                use crate::schema::project;

                // Creates inital joined query with blog table and content table
                let mut project_list = content::table
                    .inner_join(project::table.on(project::id.eq(content::id)))
                    .filter(content::content_type.eq(super::ContentType::Project))
                    .into_boxed();

                // Filter by project status
                if let Some(status) = &filters.project_status {
                    project_list = project_list.filter(project::current_status.eq(status));
                };
                
                // Get and return the count of the query
                Ok(project_list.count().get_result(db_conn)?)
            }
        }
    }
}
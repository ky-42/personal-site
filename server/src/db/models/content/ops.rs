use diesel::{prelude::*, insert_into};
use crate::{handlers::{errors::AppError, route_data::{self, ShowOrder}}, db::models::content::FullContent, schema};
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
    
    pub fn id_to_slug(
        id: i32,
        db_conn: &mut PgConnection
    ) -> Result<String, AppError> {
        use crate::schema::content;

        Ok(content::table.find(id).select(content::slug).first(db_conn)?)
    }

    pub fn slug_to_id(
        slug: &String,
        db_conn: &mut PgConnection        
    ) -> Result<i32, AppError> {
        use crate::schema::content;

        Ok(content::table.filter(content::slug.eq(slug)).select(content::id).first(db_conn)?)
    }

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
        use crate::schema::content;

        // Extra content should casscade delete on deltetion of base content
        // Reutrns number of rows effected
        Ok(diesel::delete(content::table.filter(content::slug.eq(delete_slug))).execute(db_conn)?)
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

/* -------------------------------- IMPORTANT ------------------------------- */
// I am aware just how bad the following code is. A lot of code is repeated
// in 4 places which is just terible. I tried to fix this but it was difficult
// to deal with diesel. If anyone wants to try to fix this please do so. Anyways
// I really do realize how bad this is!

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
                use crate::schema::tag;
                use crate::schema::devblog;

                // Creates inital joined query with blog table and content table
                let mut blog_list = content::table
                    .inner_join(blog::table.on(blog::id.eq(content::id)))
                    .filter(content::content_type.eq(super::ContentType::Blog))
                    .into_boxed();

                // Does paging of query
                blog_list = blog_list
                    .limit(page_info.content_per_page)
                    .offset(page_info.page * page_info.content_per_page);
                
                // Changes order of blogs returned
                blog_list = match page_info.show_order {
                    ShowOrder::Newest => blog_list.order_by(content::created_at.desc()),
                    ShowOrder::Oldest => blog_list.order_by(content::created_at.asc()),
                    _ => blog_list.order_by(content::created_at.desc())
                };
                
                // Get blogs only related to a certain project
                if let Some(project_id) = &filters.project_blogs {
                    blog_list = blog_list.filter(blog::related_project_id.eq(project_id));
                }

                // Returns list of blogs that have the same devblog assosication
                if let Some(devblog_id) = &filters.devblog_id {
                    blog_list = blog_list.filter(blog::devblog_id.eq(devblog_id));
                };
                
                // Gets all blogs with a specific tag
                if let Some(tag_title) = &filters.blog_tag {
                    let sub_query = tag::table
                        .select(0.into_sql::<diesel::sql_types::Integer>())
                        .filter(tag::blog_id.eq(blog::id))
                        .filter(tag::title.eq(tag_title));

                    blog_list = blog_list.filter(diesel::dsl::exists(sub_query));
                };
                
                // Searches tags, devblogs, title, related project and description that look like a term
                // This is very basic search and could most definitly be improved 
                if let Some(search_term) = &filters.search {
                    
                    // Query for devblog title matching
                    let devblog_sub_query = devblog::table
                        .select(0.into_sql::<diesel::sql_types::Integer>())
                        .filter(blog::devblog_id.is_not_null().and(blog::devblog_id.eq(devblog::id.nullable())))
                        .filter(devblog::title.ilike(format!("{}{}{}", "%", search_term, "%")));
                    
                    // Query for tag matching
                    let tag_sub_query = tag::table
                        .select(0.into_sql::<diesel::sql_types::Integer>())
                        .filter(tag::blog_id.eq(blog::id))
                        .filter(tag::title.ilike(format!("{}{}{}", "%", search_term, "%")));
                    
                    // Query for related project title matching
                    let content_alias = diesel::alias!(schema::content as content_alias);
                    let project_sub_query = content_alias
                        .select(0.into_sql::<diesel::sql_types::Integer>())
                        .filter(blog::related_project_id.is_not_null().and(blog::related_project_id.eq(content_alias.field(content::id).nullable())))
                        .filter(
                            content_alias.field(content::title).ilike(format!("{}{}{}", "%", search_term, "%")).or(
                                content_alias.field(content::content_desc).ilike(format!("{}{}{}", "%", search_term, "%"))
                            )
                        );
                    
                    // Adds all the queries together on the main query
                    blog_list = blog_list.filter(
                        diesel::dsl::exists(devblog_sub_query)
                        .or(diesel::dsl::exists(tag_sub_query))
                        .or(diesel::dsl::exists(project_sub_query))
                        .or(content::title.ilike(format!("{}{}{}", "%", search_term, "%")))
                        .or(content::content_desc.ilike(format!("{}{}{}", "%", search_term, "%")))
                    );
                };
            
                // Runs query to get the list of blogs 
                let list: Vec<(base::Content, extra::Blog)> = blog_list.load::<(base::Content, extra::Blog)>(db_conn)?;
                
                // Combines the base content and the blog content into one stuct
                // and puts it in a list
                let mut full_content_list: Vec<FullContent> = Vec::new();

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

                // Changes order of project returned
                project_list = project_list
                    .limit(page_info.content_per_page)
                    .offset(page_info.page * page_info.content_per_page)
                    .order_by(content::created_at.desc());

                // Changes order of project returned
                project_list = match page_info.show_order {
                    ShowOrder::Newest => project_list.order_by(content::created_at.desc()),
                    ShowOrder::Oldest => project_list.order_by(content::created_at.asc()),
                    ShowOrder::ProjectStartNewest => project_list.order_by(project::start_date.desc()),
                    ShowOrder::ProjectStartOldest => project_list.order_by(project::start_date.asc())
                };

                // Filters by project status
                if let Some(status) = &filters.project_status {
                    project_list = project_list.filter(project::current_status.eq(status));
                };
                
                // Searches projects based on title and description
                if let Some(search_term) = &filters.search {
                    project_list = project_list
                        .filter(content::title.ilike(format!("{}{}{}", "%", search_term, "%")))
                        .or_filter(content::content_desc.ilike(format!("{}{}{}", "%", search_term, "%")));
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
                use crate::schema::tag;
                use crate::schema::devblog;

                // Creates inital joined query with blog table and content table
                let mut blog_list = content::table
                    .inner_join(blog::table.on(blog::id.eq(content::id)))
                    .filter(content::content_type.eq(super::ContentType::Blog))
                    .into_boxed();
                
                // Get blogs only related to a certain project
                if let Some(project_id) = &filters.project_blogs {
                    blog_list = blog_list.filter(blog::related_project_id.eq(project_id));
                }

                // Returns list of blogs that have the same devblog assosication
                if let Some(devblog_id) = &filters.devblog_id {
                    blog_list = blog_list.filter(blog::devblog_id.eq(devblog_id));
                };
                
                // TODO Need to test this
                // Gets all blogs with a specific tag
                if let Some(tag_title) = &filters.blog_tag {
                    let sub_query = tag::table
                        .select(0.into_sql::<diesel::sql_types::Integer>())
                        .filter(tag::blog_id.eq(blog::id))
                        .filter(tag::title.eq(tag_title));

                    blog_list = blog_list.filter(diesel::dsl::exists(sub_query));
                };
                
                // Searches tags, devblogs, title, related project and description that look like a term
                // This is very basic search and could most definitly be improved 
                if let Some(search_term) = &filters.search {
                    
                    // Query for devblog title matching
                    let devblog_sub_query = devblog::table
                        .select(0.into_sql::<diesel::sql_types::Integer>())
                        .filter(blog::devblog_id.is_not_null().and(blog::devblog_id.eq(devblog::id.nullable())))
                        .filter(devblog::title.ilike(format!("{}{}{}", "%", search_term, "%")));
                    
                    // Query for tag matching
                    let tag_sub_query = tag::table
                        .select(0.into_sql::<diesel::sql_types::Integer>())
                        .filter(tag::blog_id.eq(blog::id))
                        .filter(tag::title.ilike(format!("{}{}{}", "%", search_term, "%")));
                    
                    // Query for related project title matching
                    let content_alias = diesel::alias!(schema::content as content_alias);
                    let project_sub_query = content_alias
                        .select(0.into_sql::<diesel::sql_types::Integer>())
                        .filter(blog::related_project_id.is_not_null().and(blog::related_project_id.eq(content_alias.field(content::id).nullable())))
                        .filter(
                            content_alias.field(content::title).ilike(format!("{}{}{}", "%", search_term, "%")).or(
                                content_alias.field(content::content_desc).ilike(format!("{}{}{}", "%", search_term, "%"))
                            )
                        );
                    
                    // Adds all the queries together on the main query
                    blog_list = blog_list.filter(
                        diesel::dsl::exists(devblog_sub_query)
                        .or(diesel::dsl::exists(tag_sub_query))
                        .or(diesel::dsl::exists(project_sub_query))
                        .or(content::title.ilike(format!("{}{}{}", "%", search_term, "%")))
                        .or(content::content_desc.ilike(format!("{}{}{}", "%", search_term, "%")))
                    );
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

                // Filters by project status
                if let Some(status) = &filters.project_status {
                    project_list = project_list.filter(project::current_status.eq(status));
                };
                
                // Searches projects based on title and description
                if let Some(search_term) = &filters.search {
                    project_list = project_list
                        .filter(content::title.ilike(format!("{}{}{}", "%", search_term, "%")))
                        .or_filter(content::content_desc.ilike(format!("{}{}{}", "%", search_term, "%")));
                };

                // Get and return the count of the query
                Ok(project_list.count().get_result(db_conn)?)
            }
        }
    }
}

/* ----------------------------- Tag Operations ----------------------------- */

mod tag_ops {
    use super::*;
    use crate::{schema::tag, db::models::content::extra::Tag};

    impl Tag {
        // Gets tags related to blogs
        pub fn get_blogs_tags(
            blog_id: i32,
            db_conn: &mut PgConnection
        ) -> Result<Vec<Tag>, AppError> {
            Ok(tag::table.filter(tag::blog_id.eq(blog_id)).get_results(db_conn)?)
        }

        // Removes all tags related to a blog
        pub fn remove_tags(
            blog_id: i32,
            db_conn: &mut PgConnection
        ) -> Result<usize, AppError> {
            Ok(diesel::delete(tag::table.filter(tag::blog_id.eq(blog_id))).execute(db_conn)?)
        }
        
        // Adds list of tags to a blog
        pub fn add_tags(
            tag_strings: &Vec<String>,
            blog_id: i32,
            db_conn: &mut PgConnection
        ) -> Result<(), AppError> {
            let mut intertable_values = vec![];
            
            // Creates an array of objects that can be inserted in to the tags table
            for string_tag in tag_strings {
                intertable_values.push(
                    (tag::blog_id.eq(blog_id), tag::title.eq(string_tag))
                );
            }
            
            insert_into(tag::table)
                .values(intertable_values)
                .execute(db_conn)?;
            
            Ok(())
        }
    }
}

/* --------------------------- Devblog Operations --------------------------- */

pub mod devblog_ops {
    use super::*;
    use chrono::{DateTime, Utc};
    use crate::{schema::devblog, db::models::content::extra::{Devblog, NewDevblog}, handlers::route_data::SurroundingBlogs};

    pub trait DevblogString {
        fn get_devblog(&self, db_conn: &mut PgConnection) -> Result<Devblog, AppError>;
        fn search_devblogs(&self, db_conn: &mut PgConnection) -> Result<Vec<Devblog>, AppError>;
    }
    
    impl DevblogString for String {
        // Gets a devlog object based of string assumed to be title
        fn get_devblog(&self, db_conn: &mut PgConnection) -> Result<Devblog, AppError> {
            Ok(devblog::table
                .filter(devblog::title.eq(self))
                .get_result(db_conn)?)
        }
        
        // Looks and returns devlog objects based of string assumed to be title
        fn search_devblogs(&self, db_conn: &mut PgConnection) -> Result<Vec<Devblog>, AppError> {
            Ok(devblog::table
                .filter(devblog::title.ilike(format!("{}{}{}", "%", self, "%")))
                .get_results::<Devblog>(db_conn)?)
        }
    }
    
    impl NewDevblog {
        pub fn add (
            &self,
            db_conn: &mut PgConnection
        ) -> Result<i32, AppError> {
            let results: i32 = insert_into(devblog::table)
                .values(self)
                .returning(devblog::id)
                .get_result(db_conn)?;

            Ok(results)
        }
    }
    
    impl Devblog {
        pub fn delete (
            title: String,
            db_conn: &mut PgConnection
        ) -> Result<usize, AppError> {
            Ok(diesel::delete(devblog::table.filter(devblog::title.eq(title))).execute(db_conn)?)
        }
        
        pub fn update(
            &self,
            db_conn: &mut PgConnection
        ) -> Result<(), AppError> {
            self.save_changes::<Devblog>(db_conn)?;
            Ok(())
        }
        
        pub fn get_devblog_from_id(
            devblog_id: i32,
            db_conn: &mut PgConnection
        ) -> Result<Devblog, AppError> {
            Ok(devblog::table
                .filter(devblog::id.eq(devblog_id))
                .get_result(db_conn)?)
        }

        // Gets the next and previous blogs in a devblog series
        pub fn get_surrounding_blogs(
            devblog_id: i32,
            blog_slug: String,
            // How many content peice to show in each direction
            direction_count: i64,
            db_conn: &mut PgConnection
        ) -> Result<SurroundingBlogs, AppError> {
            use crate::schema::{blog, content};
            
            let compare_date: DateTime<Utc> = content::table
                .filter(content::slug.eq(blog_slug))
                .select(content::created_at)
                .first(db_conn)?;
            
            // Uses the date to order the devblogs and gets blogs published before and after
            // the given blog
            let before_results: Vec<(base::Content, extra::Blog)> = content::table
                .inner_join(blog::table.on(blog::id.eq(content::id)))
                .filter(blog::devblog_id.eq(devblog_id))
                .filter(content::created_at.lt(compare_date))
                .limit(direction_count)
                .order_by(content::created_at.desc())
                .load::<(base::Content, extra::Blog)>(db_conn)?;

            let after_results: Vec<(base::Content, extra::Blog)> = content::table
                .inner_join(blog::table.on(blog::id.eq(content::id)))
                .filter(blog::devblog_id.eq(devblog_id))
                .filter(content::created_at.gt(compare_date))
                .limit(direction_count)
                .order_by(content::created_at.asc())
                .load::<(base::Content, extra::Blog)>(db_conn)?;
            
            // Puts data in FullContent then in SurroundingBlogs
            Ok(SurroundingBlogs {
                before_blogs: before_results.into_iter().map(|content_blog| {
                    FullContent {
                        base_content: content_blog.0,
                        extra_content: extra::ExtraContent::Blog(content_blog.1) }
                }).collect(),
                after_blogs: after_results.into_iter().map(|content_blog| {
                    FullContent {
                        base_content: content_blog.0,
                        extra_content: extra::ExtraContent::Blog(content_blog.1) }
                }).collect()
            })
        }
    }
}
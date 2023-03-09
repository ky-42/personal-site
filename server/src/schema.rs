// @generated automatically by Diesel CLI.

pub mod sql_types {
    #[derive(diesel::sql_types::SqlType, diesel::query_builder::QueryId)]
    #[diesel(postgres_type(name = "contenttype"))]
    pub struct Contenttype;

    #[derive(diesel::sql_types::SqlType, diesel::query_builder::QueryId)]
    #[diesel(postgres_type(name = "projectstatus"))]
    pub struct Projectstatus;
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::Contenttype;

    blog (id) {
        id -> Int4,
        content_type -> Contenttype,
        related_project_id -> Nullable<Int4>,
        devblog_id -> Nullable<Int4>,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::Contenttype;

    content (id) {
        id -> Int4,
        content_type -> Contenttype,
        slug -> Text,
        title -> Text,
        content_desc -> Nullable<Text>,
        body -> Text,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}

diesel::table! {
    devblog (id) {
        id -> Int4,
        title -> Text,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::Projectstatus;
    use super::sql_types::Contenttype;

    project (id) {
        id -> Int4,
        current_status -> Projectstatus,
        content_type -> Contenttype,
        github_link -> Nullable<Text>,
        url -> Nullable<Text>,
    }
}

diesel::table! {
    tag (id) {
        id -> Int4,
        tag_title -> Text,
    }
}

diesel::table! {
    tag_link (id) {
        id -> Int4,
        blog_id -> Int4,
        tag_id -> Int4,
    }
}

diesel::joinable!(blog -> devblog (id));
diesel::joinable!(blog -> project (id));
diesel::joinable!(tag_link -> blog (id));
diesel::joinable!(tag_link -> tag (id));

diesel::allow_tables_to_appear_in_same_query!(
    blog,
    content,
    devblog,
    project,
    tag,
    tag_link,
);

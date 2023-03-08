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
        tags -> Nullable<Array<Nullable<Text>>>,
        content_type -> Contenttype,
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
    use diesel::sql_types::*;
    use super::sql_types::Projectstatus;
    use super::sql_types::Contenttype;

    project (id) {
        id -> Int4,
        current_status -> Projectstatus,
        content_type -> Contenttype,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    blog,
    content,
    project,
);

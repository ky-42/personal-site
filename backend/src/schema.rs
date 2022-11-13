// @generated automatically by Diesel CLI.

diesel::table! {
    blog (id) {
        content_id -> Int4,
        tags -> Nullable<Array<Nullable<Text>>>,
        id -> Int4,
        content_type -> Text,
    }
}

diesel::table! {
    content (id) {
        id -> Int4,
        content_type -> Text,
        slug -> Text,
        title -> Text,
        content_desc -> Nullable<Text>,
        body -> Text,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}

diesel::table! {
    project (id) {
        content_id -> Int4,
        current_status -> Text,
        id -> Int4,
        content_type -> Text,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    blog,
    content,
    project,
);

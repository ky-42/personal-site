table! {
    blog (id) {
        id -> Int4,
        tags -> Nullable<Array<Text>>,
    }
}

table! {
    content (id) {
        id -> Int4,
        content_type -> Contenttype,
        slug -> Text,
        title -> Text,
        content_desc -> Nullable<Text>,
        body -> Text,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
        project_id -> Nullable<Int4>,
        blog_id -> Nullable<Int4>,
    }
}

table! {
    project (id) {
        id -> Int4,
        current_status -> Projectstatus,
    }
}

joinable!(content -> blog (blog_id));
joinable!(content -> project (project_id));

allow_tables_to_appear_in_same_query!(
    blog,
    content,
    project,
);

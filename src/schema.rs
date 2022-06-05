table! {
    blog (id) {
        id -> Int4,
        content_id -> Int4,
        tags -> Nullable<Array<Text>>,
    }
}

table! {
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

table! {
    project (id) {
        id -> Int4,
        content_id -> Int4,
        current_status -> Text,
    }
}

joinable!(blog -> content (content_id));
joinable!(project -> content (content_id));

allow_tables_to_appear_in_same_query!(
    blog,
    content,
    project,
);



//TODO make a model that is changeable that dont have
// times or id and are all option feilds
#[derive(Queryable, AsChangeset, Identifiable, Serialize, Deserialize, Debug)]
#[diesel(table_name = content)]
#[diesel(treat_none_as_null = true)]
pub struct Content {
    id: i32,
    pub content_type: String,
    slug: String,
    title: String,
    content_desc: Option<String>,
    body: String,
    created_at: DateTime<Utc>,
    updated_at: DateTime<Utc>,
}


#[derive(Serialize, Deserialize, Debug)]
pub struct FullContent {
    pub base_content: Content,
    pub extra_content: ExtraContent,
}

#[derive(Insertable, Deserialize, Serialize, Debug)]
#[diesel(table_name = content)]
pub struct NewContent {
    content_type: String,
    slug: String,
    title: String,
    content_desc: Option<String>,
    body: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct NewFullContent {
    pub new_base_content: NewContent,
    pub new_extra_content: NewExtraContent,
} 
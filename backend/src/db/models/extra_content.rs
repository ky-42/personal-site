
#[derive(Queryable, AsChangeset, Identifiable, Associations, Serialize, Deserialize, Debug)]
#[diesel(table_name = project, belongs_to(Content))]
pub struct Project {
    id: i32,
    content_id: i32,
    current_status: String,
}

impl Project {
    pub fn get_content_id(&self) -> i32 {
        self.content_id
    }
}

#[derive(Queryable, AsChangeset, Identifiable, Associations, Serialize, Deserialize, Debug)]
#[diesel(treat_none_as_null = true, table_name = blog, belongs_to(Content))]
pub struct Blog {
    id: i32,
    content_id: i32,
    tags: Option<Vec<Option<String>>>,
}

#[derive(Insertable, Deserialize, Serialize, Debug)]
#[diesel(table_name = project)]
pub struct NewProject {
    pub current_status: String,
}

#[derive(Insertable, Deserialize, Serialize, Debug)]
#[diesel(table_name = blog)]
pub struct NewBlog {
    tags: Option<Vec<String>>,
}
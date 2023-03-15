use serde::{self, Deserialize, Serialize};

/* -------------------------------------------------------------------------- */

#[derive(Deserialize, Serialize, Debug)]
pub struct DbRows {
    pub rows_effected: i32
}

#[derive(Deserialize, Debug)]
pub enum ShowOrder {
    Newest,
    Oldest,
    ProjectStartNewest,
    ProjectStartOldest
}

#[derive(Deserialize, Debug)]
pub struct PageInfo {
    pub content_per_page: i64,
    pub page: i64,
    pub show_order: ShowOrder
}

impl Default for PageInfo {
    fn default() -> PageInfo {
        PageInfo {
            content_per_page: 4,
            page: 1,
            show_order: ShowOrder::Newest,
        }
    }
}

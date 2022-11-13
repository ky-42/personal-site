use serde::{self, Deserialize, Serialize};

pub mod base;
pub mod extra;

#[derive(Serialize, Deserialize, Debug)]
pub struct FullContent {
    pub base_content: base::Content,
    pub extra_content: extra::ExtraContent,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct NewFullContent {
    pub new_base_content: base::NewContent,
    pub new_extra_content: extra::NewExtraContent,
} 
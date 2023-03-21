pub mod content;

/* --------------------------- Custom deserialize --------------------------- */

pub mod deserialize_helpers {
    use serde::{Deserializer, Deserialize};

    pub fn empty_string_as_none<'de, D: Deserializer<'de>>(d: D) -> Result<Option<String>, D::Error> {
        let o: Option<String> = Option::deserialize(d)?;
        Ok(o.filter(|s| !s.is_empty()))
    }
}

pub mod content;

/* --------------------------- Custom deserialize --------------------------- */

pub mod deserialize_helpers {
    use serde::{Deserializer, Deserialize};

    pub fn empty_string_as_none<'de, D: Deserializer<'de>>(d: D) -> Result<Option<String>, D::Error> {
        let o: Option<String> = Option::deserialize(d)?;
        Ok(o.filter(|s| !s.is_empty()))
    }
    pub fn empty_vec_as_none<'de, D: Deserializer<'de>, T: Deserialize<'de>>(d: D) -> Result<Option<Vec<T>>, D::Error> {
        let o: Option<Vec<T>> = Option::deserialize(d)?;
        Ok(o.filter(|v| !v.is_empty()))
    }
}

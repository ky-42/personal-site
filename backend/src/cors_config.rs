use actix_cors::Cors;

pub fn cors_config() -> actix_cors::Cors {
  Cors::default()
    .allowed_origin("https://kyledenief.me")
    .allowed_origin("https://www.kyledenief.me")
    .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
    .allow_any_header()
}
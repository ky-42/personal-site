use actix_cors::Cors;
use std::env;

// CORS settings for app
pub fn cors_config() -> actix_cors::Cors {
  Cors::default()
    .allowed_origin_fn(|origin, _| {
      // Allows any origin from any subdomin on a specified URL set in .env
      origin.as_bytes().ends_with(
        env::var("URL")
          .expect("Please set URL in .env")
          .as_bytes()
      )
    })
    .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
    .allow_any_header()
}
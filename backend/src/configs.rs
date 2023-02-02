// For route config
use crate::handlers::content;
use actix_web::{web};

// For CORS config
use actix_cors::Cors;
use std::env;

/* -------------------------------------------------------------------------- */

// Configures all routing for the app
// No routing should take place outside of this function
pub fn route_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/content")
            .service(web::resource("/add").route(web::post().to(content::add_content)))
            .service(web::resource("/list").route(web::get().to(content::list_content)))
            // Routes for a single existing peice of content
            .service(
                web::resource("/{slug}")
                    .route(web::get().to(content::view_content))
                    .route(web::put().to(content::update_content))
                    .route(web::delete().to(content::delete_content)),
            )
    );
}


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

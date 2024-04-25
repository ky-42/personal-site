// For route config
use crate::handlers::content;
use actix_web::web;

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
            .service(
                web::resource("/view-from-id/{id}").route(web::get().to(content::view_from_id)),
            )
            // Routes for a single existing piece of content
            .service(
                web::resource("/{slug}")
                    .route(web::get().to(content::view_content))
                    .route(web::put().to(content::update_content))
                    .route(web::delete().to(content::delete_content)),
            ),
    );

    // Routes for tag operations relating to a blog
    cfg.service(
        web::scope("/tag").service(
            web::resource("/{slug}")
                .route(web::get().to(content::get_tags))
                .route(web::post().to(content::add_tags))
                .route(web::delete().to(content::delete_tags)),
        ),
    );

    // Routes for dealing with devblogs including all crud routes
    cfg.service(
        web::scope("/devblog")
            .service(web::resource("/add").route(web::post().to(content::add_devblog)))
            // Given a blog gets next and previous blogs in devlog
            .service(
                web::resource("/get-next-prev-blog")
                    .route(web::get().to(content::get_surrounding_blogs)),
            )
            .service(
                web::resource("/view-from-id/{id}")
                    .route(web::get().to(content::get_devblog_from_id)),
            )
            .service(
                web::resource("/{title}")
                    .route(web::get().to(content::get_devblog))
                    .route(web::put().to(content::update_devblog))
                    .route(web::delete().to(content::delete_devblog)),
            ),
    );
}

// CORS settings for app
pub fn cors_config() -> actix_cors::Cors {
    Cors::default()
        .allowed_origin_fn(|origin, _| {
            // Allows any origin from any subdomain on a specified URL set in .env
            origin
                .as_bytes()
                .ends_with(env::var("URL").expect("Please set URL in .env").as_bytes())
        })
        .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
        .allow_any_header()
}

use actix_web::web;

use crate::handlers::content;

pub fn route_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api").service(
            web::scope("/content")
                .service(
                    web::resource("/{slug}")
                        .route(web::get().to(content::view_content))
                        .route(web::put().to(content::update_content))
                        .route(web::delete().to(content::delete_content)),
                )
                .service(web::resource("/add").route(web::post().to(content::add_content)))
                .service(web::resource("/list").route(web::get().to(content::list_content))),
        ),
    );
}

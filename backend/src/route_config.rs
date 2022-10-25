use actix_web::web;

use crate::handlers::content;

pub fn route_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/content")
            .service(web::resource("/add").route(web::post().to(content::add_content)))
            .service(web::resource("/count/{count_type}").route(web::get().to(content::count_content)))
            .service(
                web::scope("/list")
                    .service(
                        web::scope("/projects")
                            .service(
                                web::resource("/under-development")
                                    .route(web::get().to(content::under_dev_projects))
                            )    
                    )
                    .service(
                        web::resource("")
                            .route(web::get().to(content::list_content))
                    )
            )
            .service(
                web::resource("/{slug}")
                    .route(web::get().to(content::view_content))
                    .route(web::put().to(content::update_content))
                    .route(web::delete().to(content::delete_content)),
            )
    );
}

#[macro_use]
extern crate diesel;
use actix_web::{middleware::Logger, web, App, HttpServer};
use dotenv;
use std::env;

mod db;
mod handlers;
mod route_config;
mod schema;

// TODO Move admin stuff to its own module

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Loads .env file
    dotenv::dotenv().ok();

    // For logging
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    // Gets database pool
    let db_pool = db::create_db_pool();
    // Sets get admin password from env and creates struct
    let admin_info = handlers::extractors::AdminInfo {
        admin_password: env::var("ADMIN_PASSWORD").expect("Please set admin password"),
    };

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .app_data(web::Data::new(db_pool.clone()))
            .app_data(web::Data::new(admin_info.clone()))
            .configure(route_config::route_config)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::test;
    
    fn setup_app() -> (db::DbPool, handlers::extractors::AdminInfo) {
        std::env::set_var("RUST_LOG", "actix_web=debug");
        env_logger::init();
        dotenv::dotenv().ok();
        
        let db_pool = db::create_db_pool();
        let admin_info = handlers::extractors::AdminInfo {
            admin_password: env::var("ADMIN_PASSWORD").expect("Please set admin password"),
        };

        (
            db_pool,
            admin_info
        )
    }
    
    #[actix_web::test]
    async fn single_content() {
        let (db_pool, admin_info) = setup_app();
        let app = test::init_service(
            App::new()
                .wrap(Logger::default())
                .app_data(web::Data::new(db_pool.clone()))
                .app_data(web::Data::new(admin_info.clone()))
                .configure(route_config::route_config)
        ).await;

        // Send content add request
        // Todo randomize between project and blog
        let add_data = db::models::NewFullContent::random_content();
        let add_request = test::TestRequest::post()
            .uri("/api/content/add")
            .set_json(&add_data)
            .insert_header(("Authorization", admin_info.admin_password.to_owned()))
            .to_request();
        let add_response = test::call_service(&app, add_request).await;
        assert!(add_response.status().is_success());
        
        // Sends view request. Gets the content that was added
        let view_request = test::TestRequest::get()
            .uri(&format!("/api/content/{}", add_data.get_slug()))
            .to_request();
        let mut view_response: db::models::FullContent = test::call_and_read_body_json(&app, view_request).await;

        //Todo add test to check extra content
        assert_eq!(add_data.get_body(), view_response.get_body());
        assert_eq!(add_data.get_title(), view_response.get_title());
        
        // Sends update request. Changes slug 
        view_response.set_slug(String::from("new-slug"));
        let update_request = test::TestRequest::put()
            .uri(&format!("/api/content/{}", view_response.get_slug()))
            .set_json(&view_response)
            .insert_header(("Authorization", admin_info.admin_password.to_owned()))
            .to_request();
        test::call_service(&app, update_request).await;
        
        // Rerequests content now that its updated
        // We know the slug updated if the request worked cause we request with the slug
        // so we dont need to check anything
        let update_view_request = test::TestRequest::get()
            .uri("/api/content/new-slug")
            .to_request();
        test::call_service(&app, update_view_request).await;

        // Delete the content that was added from the db
        let delete_request = test::TestRequest::delete()
            .uri("/api/content/new-slug")
            .insert_header(("Authorization", admin_info.admin_password.to_owned()))
            .to_request();
        let delete_response: db::models::DbRows = test::call_and_read_body_json(&app, delete_request).await;
        assert!(delete_response.rows_effected == 1);
        //Todo maybe add another check to make sure the right one got deleted
    }
}
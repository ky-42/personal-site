#[macro_use]
extern crate diesel;
use actix_web::{middleware::Logger, web, App, HttpServer};
use dotenv;
use std::env;

mod db;
mod handlers;
mod configs;
mod schema;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Loads .env file
    dotenv::dotenv().ok();

    // For logging
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    // Runs database migrations
    db::run_migrations();
    // Creates a database connection pool
    let db_pool = db::create_db_pool();

    // Sets get admin password from env and creates struct
    let admin_info = handlers::extractors::AdminInfo {
        admin_password: env::var("ADMIN_PASSWORD").expect("Please set admin password"),
    };

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .wrap(configs::cors_config())
            .app_data(web::Data::new(db_pool.clone()))
            .app_data(web::Data::new(admin_info.clone()))
            .configure(configs::route_config)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}






#[cfg(test)]
mod tests {

    use super::*;
    use actix_web::test;
    use std::collections::HashMap;
    use std::sync::Once;
    use db::models::content::extra::NewExtraContent;
    use crate::db::models::content::FullContentList;
    // use rand::Rng;

    static INIT: Once = Once::new();

    fn setup_app() -> (db::DbPool, handlers::extractors::AdminInfo) {
        INIT.call_once(|| {
            dotenv::dotenv().ok();
            std::env::set_var("RUST_LOG", "actix_web=debug");
            env_logger::init();
        });
        
        // Change this to mod or something this is repeating operations
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
                .configure(configs::route_config)
        ).await;

        // Send content add request
        // Todo randomize between project and blog
        let add_data = db::models::content::NewFullContent::random_content();
        let add_request = test::TestRequest::post()
            .uri("/content/add")
            .set_json(&add_data)
            .insert_header(("Authorization", admin_info.admin_password.to_owned()))
            .to_request();
        let add_response = test::call_service(&app, add_request).await;
        assert!(add_response.status().is_success());
        
        // Sends view request. Gets the content that was added
        let view_request = test::TestRequest::get()
            .uri(&format!("/content/{}", add_data.new_base_content.get_slug()))
            .to_request();
        let mut view_response: db::models::content::FullContent = test::call_and_read_body_json(&app, view_request).await;
        
        // Sends update request. Changes slug 
        view_response.base_content.set_slug(String::from("new-slug"));
        let update_request = test::TestRequest::put()
            .uri(&format!("/content/{}", view_response.base_content.get_slug()))
            .set_json(&view_response)
            .insert_header(("Authorization", admin_info.admin_password.to_owned()))
            .to_request();
        test::call_service(&app, update_request).await;
        
        // Rerequests content now that its updated
        // We know the slug updated if the request worked cause we request with the slug
        // so we dont need to check anything
        let update_view_request = test::TestRequest::get()
            .uri("/content/new-slug")
            .to_request();
        test::call_service(&app, update_view_request).await;

        // Delete the content that was added from the db
        let delete_request = test::TestRequest::delete()
            .uri("/content/new-slug")
            .insert_header(("Authorization", admin_info.admin_password.to_owned()))
            .to_request();
        let delete_response: handlers::route_data::DbRows = test::call_and_read_body_json(&app, delete_request).await;
        assert!(delete_response.rows_effected == 1);
        //Todo maybe add another check to make sure the right one got deleted
    }
    
    #[actix_web::test]
    async fn list_test() {
        let (db_pool, admin_info) = setup_app();
        let app = test::init_service(
            App::new()
                .wrap(Logger::default())
                .app_data(web::Data::new(db_pool.clone()))
                .app_data(web::Data::new(admin_info.clone()))
                .configure(configs::route_config)
        ).await;
        
        let mut blogs_added: HashMap<usize, db::models::content::NewFullContent> = HashMap::new();
        let mut projects_added: HashMap<usize, db::models::content::NewFullContent> = HashMap::new();

        const CONTENT_AMOUNT: i32 = 32;

        for _ in 0..CONTENT_AMOUNT {
            let add_data = db::models::content::NewFullContent::random_content();
            let add_request = test::TestRequest::post()
                .uri("/content/add")
                .set_json(&add_data)
                .insert_header(("Authorization", admin_info.admin_password.to_owned()))
                .to_request();
            let add_response = test::call_service(&app, add_request).await;
            assert!(add_response.status().is_success());
            
            // Saves the added content to a hashmap to compare to returned content
            match &add_data.new_extra_content {
                NewExtraContent::Project(_) => projects_added.insert(projects_added.len(), add_data), 
                NewExtraContent::Blog(_) => blogs_added.insert(blogs_added.len(), add_data), 
            };
        }
        
        // Request for the content that was just added
        let list_request_project = test::TestRequest::get()
            .uri("/content/list?content_per_page=6&page=0&show_order=Newest&content_type=project")
            .to_request();
        let list_request_project_two = test::TestRequest::get()
            .uri("/content/list?content_per_page=6&page=1&show_order=Newest&content_type=project")
            .to_request();
        let list_request_blog = test::TestRequest::get()
            .uri("/content/list?content_per_page=6&page=0&show_order=Newest&content_type=blog")
            .to_request();
        let list_request_blog_two = test::TestRequest::get()
            .uri("/content/list?content_per_page=6&page=1&show_order=Newest&content_type=blog")
            .to_request();
        let projects_returned: FullContentList = test::call_and_read_body_json(&app, list_request_project).await;
        let blogs_returned: FullContentList = test::call_and_read_body_json(&app, list_request_blog).await;
        let projects_returned_two: FullContentList = test::call_and_read_body_json(&app, list_request_project_two).await;
        let blogs_returned_two: FullContentList = test::call_and_read_body_json(&app, list_request_blog_two).await;

        // Checks content recived above vs what was added
        assert_eq!(projects_returned.get_list().get(2).unwrap().base_content.get_slug(), projects_added.get(&(projects_added.len() - 3)).unwrap().new_base_content.get_slug());
        assert_eq!(projects_returned_two.get_list().get(2).unwrap().base_content.get_slug(), projects_added.get(&(projects_added.len() - 9)).unwrap().new_base_content.get_slug());
        assert_eq!(blogs_returned.get_list().get(2).unwrap().base_content.get_slug(), blogs_added.get(&(blogs_added.len() - 3)).unwrap().new_base_content.get_slug());
        assert_eq!(blogs_returned_two.get_list().get(2).unwrap().base_content.get_slug(), blogs_added.get(&(blogs_added.len() - 9)).unwrap().new_base_content.get_slug());
        assert_eq!(projects_returned.get_list().len(), 6);

        // Deletes all added content
        for value in projects_added.values().chain(blogs_added.values()) {
            let delete_request = test::TestRequest::delete()
                .uri(&format!("/content/{}", value.new_base_content.get_slug()))
                .insert_header(("Authorization", admin_info.admin_password.to_owned()))
                .to_request();
            let delete_response: handlers::route_data::DbRows = test::call_and_read_body_json(&app, delete_request).await;
            assert!(delete_response.rows_effected == 1);
        }
    }
    
    
    #[ignore]
    #[actix_web::test]
    async fn add_test_content() {
        create_test_content(None).await;
    }

    // Creates test content can and can be used in other tests or by the test above
    async fn create_test_content(add_amount: Option<i32>) -> HashMap<i32, db::models::content::NewFullContent> {
        let (db_pool, admin_info) = setup_app();
        let app = test::init_service(
            App::new()
                .wrap(Logger::default())
                .app_data(web::Data::new(db_pool.clone()))
                .app_data(web::Data::new(admin_info.clone()))
                .configure(configs::route_config)
        ).await;
        
        let mut added_content: HashMap<i32, db::models::content::NewFullContent> = HashMap::new();
        
        let add_amount = match add_amount {
            Some(amount) => amount,
            None => 16
        };

        // Adds 16 pieces of content to db
        for req_number in (0..add_amount).rev() {
            let add_data = db::models::content::NewFullContent::random_content();
            let add_request = test::TestRequest::post()
                .uri("/content/add")
                .set_json(&add_data)
                .insert_header(("Authorization", admin_info.admin_password.to_owned()))
                .to_request();
            let add_response = test::call_service(&app, add_request).await;
            assert!(add_response.status().is_success());
            
            // Saves the added content to a hashmap to compare to returned content
            added_content.insert(req_number, add_data);
        };

        added_content
    }
}
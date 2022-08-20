#[macro_use]
extern crate diesel;
use actix_web::{middleware::Logger, web, App, HttpServer};

mod db;
mod handlers;
mod route_config;
mod schema;

#[cfg(test)]
mod test_helpers;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // For logging
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    // Gets db pool
    let db_pool = db::create_db_pool();
    HttpServer::new(move || {
        App::new()
            // Lets routes get access to db connection
            .app_data(web::Data::new(db_pool.clone()))
            .wrap(Logger::default())
            .configure(route_config::route_config)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

use actix_web::{
    HttpServer,
    App,
    middleware::{
        Logger,
    }
};

mod route_config;
mod handlers;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .configure(route_config::route_config)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

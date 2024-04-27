pub mod models;
use diesel::prelude::*;
use diesel::{
    pg::PgConnection,
    r2d2::{self, ConnectionManager},
};
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use std::env;

pub type DbPool = r2d2::Pool<ConnectionManager<PgConnection>>;

// Embeds migrations into compiled executable
pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

pub fn create_db_pool() -> DbPool {
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool.")
}

pub fn run_migrations() {
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    // Creates a db connection then runs the migrations that are compiled into the executable
    PgConnection::establish(&database_url)
        .expect("Could not get db connection for migrations")
        .run_pending_migrations(MIGRATIONS)
        .expect("Could not run migrations");
}

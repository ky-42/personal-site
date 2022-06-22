use diesel::prelude::*;
pub fn db_connection() -> PgConnection {
    let url = dotenv::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    PgConnection::establish(&url)
        .expect("Something went wrong getting db connection")
}
use actix_web::{
    error::{BlockingError, ResponseError},
    http::{header, StatusCode},
    HttpResponse,
};
use derive_more::Display;
use diesel;
use r2d2;

#[derive(Display, Debug)]
pub enum ContentError {
    ContentNotFound,
    #[display(fmt = "Database Error")]
    DbError,
    #[display(fmt = "Error with web blocking")]
    WebBlockError,
    #[display(fmt = "You are not the site admin")]
    NotAdmin,
}

// Makes error able to be returned by handler
impl ResponseError for ContentError {
    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(self.status_code())
            .insert_header(header::ContentType::html())
            .body(self.to_string())
    }
    fn status_code(&self) -> StatusCode {
        match self {
            ContentError::ContentNotFound => StatusCode::NOT_FOUND,
            ContentError::DbError => StatusCode::INTERNAL_SERVER_ERROR,
            ContentError::WebBlockError => StatusCode::INTERNAL_SERVER_ERROR,
            ContentError::NotAdmin => StatusCode::UNAUTHORIZED,
        }
    }
}

// Implementations for converting between errors

impl From<r2d2::Error> for ContentError {
    fn from(_: r2d2::Error) -> Self {
        ContentError::DbError
    }
}

impl From<BlockingError> for ContentError {
    fn from(_: BlockingError) -> Self {
        ContentError::WebBlockError
    }
}

impl From<diesel::result::Error> for ContentError {
    fn from(db_error: diesel::result::Error) -> Self {
        match db_error {
            diesel::result::Error::NotFound => ContentError::ContentNotFound,
            _ => ContentError::DbError,
        }
    }
}

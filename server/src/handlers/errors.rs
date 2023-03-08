use actix_web::{
    error::{BlockingError, ResponseError},
    http::{header, StatusCode},
    HttpResponse,
};
use derive_more::Display;
use diesel;
use r2d2;
use validator::ValidationErrors;

/* -------------------------------------------------------------------------- */

#[derive(Display, Debug)]
pub enum AppError {
    ContentNotFound,
    #[display(fmt = "Database Error")]
    DbError,
    #[display(fmt = "Pool Error")]
    PoolError,
    #[display(fmt = "Error with web blocking")]
    WebBlockError,
    #[display(fmt = "You are not the site admin")]
    NotAdmin,
    #[display(fmt = "No admin password is set")]
    NoAdmin,
    #[display(fmt = "Content did not pass validation. Some values in your data are not valid")]
    ContentValidationError
}

// Makes content errors returnable by an actix web handler
impl ResponseError for AppError {
    
    //Creates a response to return when therer is a content error
    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(self.status_code())
            .insert_header(header::ContentType::html())
            .body(self.to_string())
    }

    // Converts a content error to a status code
    fn status_code(&self) -> StatusCode {
        match self {
            AppError::ContentNotFound => StatusCode::NOT_FOUND,
            AppError::DbError => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::PoolError => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::WebBlockError => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::NotAdmin => StatusCode::UNAUTHORIZED,
            AppError::NoAdmin => StatusCode::UNAUTHORIZED,
            AppError::ContentValidationError => StatusCode::BAD_REQUEST,
        }
    }
}

/* -------------------------------------------------------------------------- */
/*                        Content Error implementations                       */
/* -------------------------------------------------------------------------- */

// Implementations to convert possible errors from other libaries to a content error

impl From<r2d2::Error> for AppError {
    fn from(_: r2d2::Error) -> Self {
        AppError::PoolError
    }
}

impl From<BlockingError> for AppError {
    fn from(_: BlockingError) -> Self {
        AppError::WebBlockError
    }
}

impl From<diesel::result::Error> for AppError {
    fn from(db_error: diesel::result::Error) -> Self {
        match db_error {
            diesel::result::Error::NotFound => AppError::ContentNotFound,
            _ => AppError::DbError,
        }
    }
}

impl From<ValidationErrors> for AppError {
    fn from(_validation_error: ValidationErrors) -> Self {
        AppError::ContentValidationError
    }
}
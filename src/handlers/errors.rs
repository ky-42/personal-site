use derive_more::Display;
use actix_web::{
    error,
    HttpResponse,
    http::{
        StatusCode,
        header
    }
};

#[derive(Display, Debug)]
pub enum ContentError {
    ContentNotFound,
    #[display(fmt = "No slug provided")]
    NoSlugProvided,
    #[display(fmt = "Database Error")]
    DbError,
}

impl error::ResponseError for ContentError {
    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(self.status_code())
            .insert_header(header::ContentType::html())
            .body(self.to_string())
    }
    fn status_code(&self) -> StatusCode {
        match self {
            ContentError::ContentNotFound => StatusCode::NOT_FOUND,
            ContentError::NoSlugProvided => StatusCode::BAD_REQUEST,
            ContentError::DbError => StatusCode::INTERNAL_SERVER_ERROR
        }
    }
}


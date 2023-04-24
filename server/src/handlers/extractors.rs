use super::errors::AppError;
use actix_web::{http::header, web, FromRequest};
use std::future::{ready, Ready};

/* ------------------------ Authentication extractor ------------------------ */

#[derive(Clone)]
pub struct AdminInfo {
    pub admin_password: String,
}

pub struct AuthUser {}

impl AuthUser {
    // Authenticates a request
    fn check_request_authentication(req: &actix_web::HttpRequest) -> Result<Self, AppError> {
        //Gets server password from app and turns it into bytes
        let server_password = req
            .app_data::<web::Data<AdminInfo>>()
            .ok_or(AppError::NoAdmin)?
            .admin_password
            .as_bytes();

        //Gets password from request in the form of bytes
        let request_password = req
            .headers()
            .get(header::AUTHORIZATION)
            .ok_or(AppError::NotAdmin)?;

        if request_password == server_password {
            Ok(AuthUser {})
        } else {
            Err(AppError::NotAdmin)
        }
    }
}

// Lets the struct be used as an extractor in handlers
impl FromRequest for AuthUser {
    type Error = AppError;
    type Future = Ready<Result<Self, Self::Error>>;
    fn from_request(req: &actix_web::HttpRequest, _: &mut actix_web::dev::Payload) -> Self::Future {
        // check_request_authentication was moved to its own methods for easier error handling
        ready(AuthUser::check_request_authentication(req))
    }
}

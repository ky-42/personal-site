use super::errors::ContentError;
use actix_web::{http::header, FromRequest, web};
use std::future::{ready, Ready};

#[derive(Clone)]
pub struct AdminInfo {
    pub admin_password: String,
}

pub struct AuthUser {
    pub admin: bool,
}

impl FromRequest for AuthUser {
    type Error = ContentError;
    type Future = Ready<Result<Self, Self::Error>>;
    fn from_request(req: &actix_web::HttpRequest, _: &mut actix_web::dev::Payload) -> Self::Future {
        let request_headers = req.headers();
        let auth_header = request_headers.get(header::AUTHORIZATION);
        if let Some(password) = auth_header {
            // Todo get rid of unwrap
            let request_password = password.to_str().unwrap();
            let server_password: &str = &req
                    .app_data::<web::Data<AdminInfo>>()
                    .expect("AdminInfo not set")
                    .admin_password;
            if request_password == server_password {
                ready(Ok(AuthUser { admin: true }))
            } else {
                ready(Err(ContentError::NotAdmin))
            }
        } else {
            ready(Err(ContentError::NotAdmin))
        }
    }
}

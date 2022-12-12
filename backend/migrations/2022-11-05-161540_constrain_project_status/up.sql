CREATE TYPE ProjectStatus AS ENUM (
    'under_development',
    'finished'
);

ALTER TABLE project ALTER COLUMN current_status TYPE ProjectStatus USING current_status::ProjectStatus;
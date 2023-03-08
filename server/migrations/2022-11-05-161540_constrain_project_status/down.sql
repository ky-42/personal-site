ALTER TABLE project ALTER COLUMN current_status TYPE Text USING current_status::Text;

DROP TYPE ProjectStatus;
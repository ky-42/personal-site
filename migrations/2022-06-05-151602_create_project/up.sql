-- Your SQL goes here

CREATE TABLE project (
    id SERIAL PRIMARY KEY,
    content_id INTEGER NOT NULL REFERENCES Content (id) ON DELETE CASCADE,
    current_status TEXT NOT NULL CHECK (current_status IN ('Unfinished', 'Under Development', 'Finished'))
);


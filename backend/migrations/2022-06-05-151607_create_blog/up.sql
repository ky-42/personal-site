-- Your SQL goes here

CREATE TABLE blog (
    id SERIAL PRIMARY KEY,
    content_id INTEGER NOT NULL REFERENCES Content (id) ON DELETE CASCADE,
    tags TEXT[]
);


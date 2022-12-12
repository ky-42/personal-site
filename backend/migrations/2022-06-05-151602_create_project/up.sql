CREATE TABLE project (
    id SERIAL PRIMARY KEY,
    content_id INTEGER NOT NULL REFERENCES Content (id) ON DELETE CASCADE,
    current_status TEXT NOT NULL 
);


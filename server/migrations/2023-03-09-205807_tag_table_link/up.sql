CREATE TABLE tag (
    id SERIAL PRIMARY KEY,
    blog_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    CONSTRAINT blog_tag_link FOREIGN KEY (blog_id)
        REFERENCES blog (id)
            ON DELETE CASCADE,
    CONSTRAINT unique_blog_tag UNIQUE (blog_id, title)
);

ALTER TABLE blog DROP COLUMN tags;

CREATE TABLE tag (
    id SERIAL PRIMARY KEY,
    blog_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    CONSTRAINT blog_tag_link FOREIGN KEY (blog_id)
        REFERENCES blog (id)
            ON DELETE CASCADE,
    CONSTRAINT unique_blog_tag UNIQUE (blog_id, title)
);

-- As new tags will be in a seperate table this can be delete
-- no attempt was made to migrate this data as it wasnt used anywere before
ALTER TABLE blog DROP COLUMN tags;

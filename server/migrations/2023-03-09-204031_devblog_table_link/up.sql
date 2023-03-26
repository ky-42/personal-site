CREATE TABLE devblog (
    id SERIAL PRIMARY KEY,
    title TEXT UNIQUE NOT NULL
);

-- Adds the ability to link blogs to a devblog
ALTER TABLE blog ADD COLUMN devblog_id INTEGER;
ALTER TABLE blog
    ADD CONSTRAINT devblog_blog_link FOREIGN KEY (devblog_id)
        REFERENCES devblog (id)
            ON DELETE SET NULL;
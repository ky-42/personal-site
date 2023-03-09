CREATE TABLE tag (
    id SERIAL PRIMARY KEY,
    tag_title TEXT NOT NULL
);

CREATE TABLE tag_link (
    id SERIAL PRIMARY KEY,
    blog_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    CONSTRAINT blog_tags_link FOREIGN KEY (id)
        REFERENCES blog (id)
            ON DELETE CASCADE,
    CONSTRAINT tag_tags_link FOREIGN KEY (id)
        REFERENCES tag (id)
            ON DELETE CASCADE
);


ALTER TABLE blog DROP COLUMN tags;

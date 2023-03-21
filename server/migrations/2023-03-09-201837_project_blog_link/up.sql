-- Adds the ability to links blogs to a project
ALTER TABLE blog ADD COLUMN related_project_id INTEGER;
ALTER TABLE blog
    ADD CONSTRAINT project_blog_link FOREIGN KEY (id)
        REFERENCES project (id)
            ON DELETE SET NULL;
-- Adds content_type to projects on blog but contrains them the 
-- that value of the content type and makes sure its the same as
-- the content type on the base content row
ALTER TABLE project DROP COLUMN id;
ALTER TABLE project ADD CONSTRAINT id_pk PRIMARY KEY (content_id); 
ALTER TABLE project RENAME COLUMN content_id TO id;
ALTER TABLE project ADD COLUMN content_type TEXT DEFAULT 'project' CONSTRAINT ensure_project CHECK (content_type = 'project');
ALTER TABLE project ADD CONSTRAINT id_content_type_fk FOREIGN KEY (id, content_type) REFERENCES content (id, content_type);

ALTER TABLE blog DROP COLUMN id;
ALTER TABLE blog ADD CONSTRAINT id_pk PRIMARY KEY (content_id); 
ALTER TABLE blog RENAME COLUMN content_id TO id;
ALTER TABLE blog ADD COLUMN content_type TEXT DEFAULT 'blog' CONSTRAINT ensure_blog CHECK (content_type = 'blog');
ALTER TABLE blog ADD CONSTRAINT id_content_type_fk FOREIGN KEY (id, content_type) REFERENCES content (id, content_type);
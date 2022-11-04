-- Adds content_type to projects on blog but contrains them the 
-- that value of the content type and makes sure its the same as
-- the content type on the base content row
UPDATE project SET id = content_id;
ALTER TABLE project ADD COLUMN content_type TEXT DEFAULT 'project' CHECK (content_type = 'project');
ALTER TABLE project ADD FOREIGN KEY (id) REFERENCES content (id);
-- ALTER TABLE project ADD FOREIGN KEY (content_type) REFERENCES content (content_type);
ALTER TABLE project DROP COLUMN content_id;

-- UPDATE blog SET id = content_id;
-- ALTER TABLE blog ADD COLUMN content_type TEXT DEFAULT 'blog' CHECK (content_type = 'blog');
-- ALTER TABLE blog ADD FOREIGN KEY (id, content_type) REFERENCES content (id, content_type);
-- ALTER TABLE blog DROP COLUMN content_id;
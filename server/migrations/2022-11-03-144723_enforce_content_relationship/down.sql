ALTER TABLE blog DROP CONSTRAINT blog_pk;
ALTER TABLE blog DROP CONSTRAINT blog_id_type_fk;
ALTER TABLE blog DROP content_type;
ALTER TABLE blog RENAME COLUMN id TO content_id;
ALTER TABLE blog ADD COLUMN id SERIAL PRIMARY KEY;

ALTER TABLE project DROP CONSTRAINT project_pk;
ALTER TABLE project DROP CONSTRAINT project_id_type_fk;
ALTER TABLE project DROP content_type;
ALTER TABLE project RENAME COLUMN id TO content_id;
ALTER TABLE project ADD COLUMN id SERIAL PRIMARY KEY;

ALTER TABLE content DROP CONSTRAINT id_content_type_unique;
ALTER TABLE content ALTER COLUMN content_type TYPE Text USING content_type::Text;
ALTER TABLE content ALTER COLUMN content_type SET NOT NULL;
ALTER TABLE content ADD CONSTRAINT content_content_type_check CHECK (content_type in ('blog', 'project'));

DROP TYPE ContentType;
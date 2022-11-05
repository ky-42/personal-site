ALTER TABLE project DROP CONSTRAINT id_pk;
ALTER TABLE project DROP CONSTRAINT id_content_type_fk;
ALTER TABLE project DROP content_type;
ALTER TABLE project RENAME COLUMN id TO content_id;
ALTER TABLE project ADD COLUMN id SERIAL PRIMARY KEY;

ALTER TABLE blog DROP CONSTRAINT id_pk;
ALTER TABLE blog DROP CONSTRAINT id_content_type_fk;
ALTER TABLE blog DROP content_type;
ALTER TABLE blog RENAME COLUMN id TO content_id;
ALTER TABLE blog ADD COLUMN id SERIAL PRIMARY KEY;

ALTER TABLE content DROP CONSTRAINT id_content_type_unique;
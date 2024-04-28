ALTER TABLE content RENAME COLUMN content_desc TO description;

ALTER TABLE project RENAME COLUMN github_link TO repository_url;
ALTER TABLE project RENAME COLUMN url TO website_url;
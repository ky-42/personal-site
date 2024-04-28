ALTER TABLE content RENAME COLUMN description TO content_desc;

ALTER TABLE project RENAME COLUMN repository_url TO github_link;
ALTER TABLE project RENAME COLUMN website_url TO url;
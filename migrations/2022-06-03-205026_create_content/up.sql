-- Your SQL goes here
CREATE TYPE CONTENTTYPE AS ENUM ('blog', 'project');
CREATE TYPE PROJECTSTATUS AS ENUM ('Unfinished', 'UnderDevelopment', 'Finished');

CREATE TABLE Project (
    id SERIAL PRIMARY KEY,
    current_status PROJECTSTATUS NOT NULL
);

CREATE TABLE Blog (
    id SERIAL PRIMARY KEY,
    tags TEXT[]
);

CREATE TABLE Content (
    id SERIAL PRIMARY KEY,
    content_type CONTENTTYPE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    title TEXT UNIQUE NOT NULL,
    content_desc TEXT,
    body TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    project_id INT REFERENCES Project (id),
    blog_id INT REFERENCES Blog (id)
);

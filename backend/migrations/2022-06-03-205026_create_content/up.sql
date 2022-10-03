CREATE TABLE content (
    id SERIAL PRIMARY KEY,
    content_type TEXT NOT NULL CHECK (content_type in ('blog', 'project')),
    slug TEXT UNIQUE NOT NULL,
    title TEXT UNIQUE NOT NULL,
    content_desc TEXT,
    body TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);


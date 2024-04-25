/* -------------------------------------------------------------------------- */
/*                                Content Enums                               */
/* -------------------------------------------------------------------------- */

export enum ContentType {
  Blog = 'blog',
  Project = 'project',
}

export enum ProjectStatus {
  UnderDevelopment = 'under_development',
  Finished = 'finished',
}

/* -------------------------------------------------------------------------- */
/*                             Content Interfaces                             */
/* -------------------------------------------------------------------------- */

// If updating also update content helpers and validation functions

/* ------------------ Existing/Updatable Content Interfaces ----------------- */

export interface Content extends NewContent {
  id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Project extends NewProject {
  id: number;
  content_type: ContentType;
}

export interface Blog extends NewBlog {
  id: number;
  content_type: ContentType;
}

export interface FullContent {
  base_content: Content;
  extra_content: { project: Project } | { blog: Blog };
}

/* ------------------------- New Content Interfaces ------------------------- */

export interface NewContent {
  content_type: ContentType;
  slug: string;
  title: string;
  content_desc?: string;
  body: string;
}

export interface NewBlog {
  devblog_id?: number;
  related_project_id?: number;
}

export interface NewProject {
  current_status: ProjectStatus;
  github_link?: string;
  url?: string;
  start_date?: Date;
}

export interface NewFullContent {
  new_base_content: NewContent;
  new_extra_content: { project: NewProject } | { blog: NewBlog };
}

/* --------------------------- Content extensions -------------------------- */

export interface Tag {
  id: number;
  blog_id: number;
  title: string;
}

export interface NewDevblog {
  title: string;
}

export interface Devblog {
  id: number;
  title: string;
}

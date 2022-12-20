/* -------------------------------------------------------------------------- */
/*                                Content Enums                               */
/* -------------------------------------------------------------------------- */

export enum ContentType {
  Blog = "blog",
  Project = "project",
}
  
export enum ProjectStatus {
  UnderDevelopment = "under_development",
  Finished = "finished"
}

/* -------------------------------------------------------------------------- */
/*                             Content Interfaces                             */
/* -------------------------------------------------------------------------- */

// If updating update to new content helper and the validation methods when they are added

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
  extra_content: {project: Project} | {blog: Blog}
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
  tags?: Array<string>;
}

export interface NewProject {
  current_status: ProjectStatus;
}

export interface NewFullContent {
  new_base_content: NewContent;
  new_extra_content: {project: NewProject} | {blog: NewBlog}
}

/* -------------------------------------------------------------------------- */
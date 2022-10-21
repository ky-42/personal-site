//
// Content Enums
//

export enum ContentType {
  Blog = "blog",
  Project = "project",
}


//
// Content Interfaces
//

export interface Content extends NewContent {
  id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Project extends NewProject {
  id: number;
  content_id: number;
}

export interface Blog extends NewBlog {
  id: number;
  content_id: number;
}

export interface FullContent {
  base_content: Content;
  extra_content: {project: Project} | {blog: Blog}
}

export interface NewContent {
  content_type: string;
  slug: string;
  title: string;
  content_desc?: string;
  body: string;
}

export interface NewBlog {
  tags?: Array<string>;
}

export interface NewProject {
  current_status: string;
}

export interface NewFullContent {
  new_base_content: NewContent;
  new_extra_content: {project: NewProject} | {blog: NewBlog}
}





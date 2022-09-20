
// Enums

export enum ContentTypes {
  Blog = "Blog",
  Project = "Project"
}

export enum listOrder {
  Newest = "Newest",
  Oldest = "Oldest",
  // most_popular,
  // least_popular,
  Search = "Search",
}

// Interfaces

export interface Content {
  id: number;
  content_type: string;
  slug: string;
  title: string;
  content_desc?: string;
  body: string;
  created_at: Date;
  updated_at: Date;
}

export interface Project {
  id: number,
  content_id: number,
  current_status: string
}

export interface Blog {
  id: number,
  content_id: number,
  tags?: Array<string>
}

export interface FullContent {
  base_content: Content,
  extra_content: Project | Blog
}

export interface NewContent {
  content_type: string,
  slug: string,
  title: string,
  content_desc?: string,
  body: string,
}

export enum NewContentFeilds {
  content_type = "content_type",
  slug = "slug",
  title = "title",
  content_desc = "content_desc",
  body = "body"
}

export interface NewBlog {
  tags?: Array<string>
}

export enum NewBlogFeilds {
  tags = "tags"
}

export interface NewProject {
  current_status: string,
}

export enum NewProjectFeilds {
  current_status = "tags"
}

export interface NewFullContent {
 new_base_content: NewContent,
 new_extra_content: NewBlog | NewProject
}
  
export interface PageInfo {
  content_per_page: number,
  page: number,
  show_order: listOrder,
  content_type?: ContentTypes
}
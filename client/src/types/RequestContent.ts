import { ContentType, Devblog, FullContent, NewDevblog, NewFullContent, ProjectStatus } from "./Content";

/* -------------------------------------------------------------------------- */
/*                Types used in requests to backend for content               */
/* -------------------------------------------------------------------------- */

export interface ContentSlug {
  slug: string
}

export interface ContentPassword extends ContentSlug {
  password: string
}

export interface ContentUpdateInfo extends ContentPassword {
  updated_content: FullContent
}

export interface ContentAddParams {
  addContent: NewFullContent,
  password: string
};

export interface ContentListInfo {
  page_info: PageInfo,
  content_filters: ContentFilter
}

export enum listOrder {
  Newest = "Newest",
  Oldest = "Oldest",
}

// Used for requests that require specifiying a page
export interface PageInfo {
  content_per_page: number;
  page: number;
  show_order: listOrder;
}

export interface FullContentList {
  full_content_list: FullContent[],
  content_count: number
}

export interface ContentFilter {
  content_type: ContentType,
  project_status?: ProjectStatus,
  // Id for project to get blogs for
  project_blogs?: number,
  blog_tag?: string,
  devblog_id?: number,
  search?: string
}

/* -------------------------------------------------------------------------- */
/*                 Types used in requests to backend for tags                 */
/* -------------------------------------------------------------------------- */

export interface BlogSlug {
  blog_slug: string,
}

export interface BlogSlugPassword extends BlogSlug {
  password: string
}

export interface TagAddInfo extends BlogSlugPassword {
  tags: string[]
}

/* -------------------------------------------------------------------------- */
/*               Types used in requests to backend for devblogs               */
/* -------------------------------------------------------------------------- */

export interface DevblogTitle {
  title: string
}

export interface DevblogPassword extends DevblogTitle {
  password: string
}

export interface DevblogAddInfo {
  newDevblogInfo: NewDevblog
  password: string
}

export interface DevblogUpdateInfo extends DevblogPassword {
  updatedDevblogInfo: Devblog
}

export interface SurroundingData {
  devblog_id: number,
  blog_slug: string,
  direction_count: number
}

export interface SurroundingBlogs {
  before_blogs: FullContent[],
  after_blogs: FullContent[]
}

/* ---- Types used to help handle loading and errors when requesting data --- */

export enum RequestStatus {
  Loading,
  Success,
  Error
}

export type RequestState<RequestedData> = 
  | { requestStatus: RequestStatus.Loading }
  | { requestStatus: RequestStatus.Success, requestedData: RequestedData }
  | { requestStatus: RequestStatus.Error, requestError: string };
import {
  ContentType,
  Devblog,
  FullContent,
  NewDevblog,
  NewFullContent,
  ProjectStatus,
} from './Content';

/* -------------------------------------------------------------------------- */
/*                                   General                                  */
/* -------------------------------------------------------------------------- */

export interface Id {
  id: number;
}

/* -------------------------------------------------------------------------- */
/*                Types used in requests to backend for content               */
/* -------------------------------------------------------------------------- */

export interface ContentSlug {
  slug: string;
}

export interface ContentPassword extends ContentSlug {
  password: string;
}

export interface ContentUpdateInfo extends ContentPassword {
  updated_content: FullContent;
}

export interface ContentAddParams {
  addContent: NewFullContent;
  password: string;
}

export interface ContentListInfo {
  page_info: PageInfo;
  content_filters: ContentFilter;
}

export enum listOrder {
  Newest = 'newest',
  Oldest = 'oldest',
  ProjectStartNewest = 'project_start_newest',
  ProjectStartOldest = 'project_start_oldest',
}

// Used for requests that require specifying a page
export interface PageInfo {
  content_per_page: number;
  page: number;
  ordering: listOrder;
}

export interface FullContentList {
  full_content_list: FullContent[];
  page_count: number;
}

// When updating update searchParamsToContentFilter in HelperFuncs.ts
export interface ContentFilter {
  content_type: ContentType;
  project_status?: ProjectStatus;
  // Id for project to get blogs for
  project_id?: number;
  blog_tag?: string;
  devblog_id?: number;
  search?: string;
}

/* -------------------------------------------------------------------------- */
/*                 Types used in requests to backend for tags                 */
/* -------------------------------------------------------------------------- */

export interface BlogSlug {
  blog_slug: string;
}

export interface BlogSlugPassword extends BlogSlug {
  password: string;
}

export interface TagAddInfo extends BlogSlugPassword {
  tags: Set<string>;
}

/* -------------------------------------------------------------------------- */
/*               Types used in requests to backend for devblogs               */
/* -------------------------------------------------------------------------- */

export interface DevblogTitle {
  title: string;
}

export interface DevblogPassword extends DevblogTitle {
  password: string;
}

export interface DevblogAddInfo {
  newDevblogInfo: NewDevblog;
  password: string;
}

export interface DevblogUpdateInfo extends DevblogPassword {
  updatedDevblogInfo: Devblog;
}

export interface SurroundingData {
  devblog_id: number;
  pivot_blog_slug: string;
  neighbor_blog_count: number;
}

export interface SurroundingBlogs {
  before_blogs: FullContent[];
  after_blogs: FullContent[];
}

/* ---- Types used to help handle loading and errors when requesting data --- */

export enum RequestStatus {
  Loading,
  Success,
  Error,
}

export type RequestState<RequestedData> =
  | { requestStatus: RequestStatus.Loading }
  | { requestStatus: RequestStatus.Success; requestedData: RequestedData }
  | { requestStatus: RequestStatus.Error; requestError: string };

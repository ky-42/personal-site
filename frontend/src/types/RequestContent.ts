import { ContentType, FullContent, NewFullContent, ProjectStatus } from "./Content";

/* -------------------------------------------------------------------------- */
/*                Types used in requests to backend for content               */
/* -------------------------------------------------------------------------- */

// Options for the order to show a list of content
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

// Options for operation on an existing peice of content
export interface ContentPieceOptions {
  slug: string,
  method: string,
  password?: string
  updated_content?: FullContent
};

// Options for adding content
export interface ContentAddParams {
  addContent: NewFullContent,
  password: string
};

export interface FullContentList {
  full_content_list: FullContent[],
  content_count: number
}

export interface ContentFilter {
  content_type: ContentType,
  project_status?: ProjectStatus,
  blog_tag?: string
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
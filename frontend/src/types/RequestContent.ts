import { ContentType, FullContent, NewFullContent } from "./Content";

/* -------------------------------------------------------------------------- */
/*                Types used in requests to backend for content               */
/* -------------------------------------------------------------------------- */

// Used for requests that require specifiying a page
export interface PageInfo {
  content_per_page: number;
  page: number;
  show_order: listOrder;
  content_type?: ContentType;
}

// Options for the order to show a list of content
export enum listOrder {
  Newest = "Newest",
  // Oldest = "Oldest",
  // Search = "Search",
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
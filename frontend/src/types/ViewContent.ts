import { ContentType } from "./Content";

//
// View Content Enums
//

export enum listOrder {
  Newest = "Newest",
  Oldest = "Oldest",
  // most_popular,
  // least_popular,
  Search = "Search",
}
  
//
// View Content Interfaces
//

export interface PageInfo {
  content_per_page: number;
  page: number;
  show_order: listOrder;
  content_type?: ContentType;
}
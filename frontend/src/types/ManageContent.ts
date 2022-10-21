//
// Manage Content Enums
//

import { ContentType, NewBlog, NewContent, NewProject } from "./Content"

export enum actionTypes {
  Create = "Create",
  Update = "Update",
  Delete = "Delete"
}

export interface DeleteState {
  deleteSlug: string
}

export type NewContentFeilds = NewContent & NewBlog & NewProject;
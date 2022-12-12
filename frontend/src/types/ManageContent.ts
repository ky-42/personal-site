import { NewBlog, NewContent, NewProject } from "./Content"

/* -------------------------------------------------------------------------- */
/*                      Types for the manage content page                     */
/* -------------------------------------------------------------------------- */

export enum ActionTypes {
  Create = "Create",
  Update = "Update",
  Delete = "Delete"
}

export interface DeleteState {
  deleteSlug: string
}

export type NewContentFeilds = NewContent & NewBlog & NewProject;
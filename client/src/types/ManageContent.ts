import { NewBlog, NewContent, NewProject } from './Content';

/* -------------------------------------------------------------------------- */
/*                          Types for the manage page                         */
/* -------------------------------------------------------------------------- */

export enum ActionTypes {
  Create = 'Create',
  Update = 'Update',
  Delete = 'Delete',
  DevblogCreate = 'Devblog Create',
  DevblogUpdate = 'Devblog Update',
  DevblogDelete = 'Devblog Delete',
}

export interface DeleteState {
  deleteSlug: string;
}

export enum ReducerAction {
  Update,
  Set,
}

export interface SetReducer<T> {
  action: ReducerAction.Set;
  newState: T;
}

export interface UpdateReducer<T, K extends keyof T> {
  action: ReducerAction.Update;
  field: K;
  value: T[K];
}

export type NewContentFields = NewContent & NewBlog & NewProject;

import React, { useReducer, useState } from "react";
import styled from "styled-components";
import { ActionTypes, DeleteState, NewContentFeilds } from "../types/ManageContent";
import PageTitle from "../components/PageTitle";
import ActionButtons from "../components/ContentManagement/ActionButtons";
import ContentForm from "../components/ContentManagement/ContentForm";
import DeleteForm from "../components/ContentManagement/DeleteForm";
import PasswordSubmit from "../components/ContentManagement/PasswordSubmit";
import { ContentType, FullContent, NewBlog, NewContent, NewFullContent, NewProject } from "../types/Content";
import UpdateForm from "../components/ContentManagement/UpdateForm";
import { ContentAdd, GetContentPiece } from "../adapters/content";

// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------

const deleteInitState: DeleteState = {
  deleteSlug: ""
};

const isDeleteState = (obj: any): obj is DeleteState => {
  return obj.deleteSlug !== undefined; 
}

const deleteReducer = <K extends keyof DeleteState>(state: DeleteState, action: {field: K, value: DeleteState[K]} | DeleteState ) => {
  if (isDeleteState(action)) {
    return action;
  };

  return {...state, [action.field]: action.value}
};

const deleteSubmit = (deleteData: DeleteState, password: string) => {
  GetContentPiece({
    slug: deleteData.deleteSlug,
    method: "DELETE",
    password
  });
};

// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------


const extraBlogInit: NewFullContent["new_extra_content"] = {
  "blog": {}
} 

const extraProjectInit: NewFullContent["new_extra_content"] = {
  "project": {
    current_status: "under_development"
  }
} 

const contentInitState: NewFullContent = {
  new_base_content: {
    content_type: ContentType.Blog,
    slug: "",
    title: "",
    body: "",
  },
  new_extra_content: extraBlogInit 
};

const isNewFullContent = (obj: any): obj is NewFullContent => {
  return obj.new_base_content !== undefined; 
}

const contentReducer = (state: NewFullContent, action: {key: keyof NewContentFeilds, value: NewContentFeilds[keyof NewContentFeilds], extra?: ContentType} | NewFullContent) => {

  // I hate typescript of this mess
  // TODO fix this typescript shit
  
  if (isNewFullContent(action)) {
    return action;
  }
  
  let {new_base_content, new_extra_content} = state;
  
  switch (action.extra) {
    case ContentType.Project:
      if ("project" in new_extra_content) {
        new_extra_content.project[action.key as keyof NewProject] = action.value as NewProject[keyof NewProject];
      }
      break;
    case ContentType.Blog:
      if ("blog" in new_extra_content) {
        new_extra_content.blog[action.key as keyof NewBlog] = action.value as NewBlog[keyof NewBlog];
      }
      break;
    default:
      // TODO remove as string on line below
      new_base_content[action.key as keyof NewContent] = action.value as string
      if (action.key === "title" && typeof action.value === "string") {
        new_base_content.slug = action.value.replaceAll(" ", "-");   
      };
      if (action.key === "content_type") {
        if (action.value === "project") {
          new_extra_content = extraProjectInit;
        } else {
          new_extra_content = extraBlogInit;
        }
      }

      break;
  };

  let newState: NewFullContent = {
    new_base_content,
    new_extra_content
  };

  return newState;
};

const createSubmit = (createData: NewFullContent, password: string) => {
  ContentAdd({
    addContent: createData,
    password
  })
};

const updateSubmit = (updateData: NewFullContent, oldData: FullContent | undefined, password: string) => {
  // TODO let user update extra_content
  if (oldData !== undefined) {
    GetContentPiece({
      slug: oldData.base_content.slug,
      method: "PUT",
      password,
      updated_content: {
        base_content: {...oldData.base_content, ...updateData.new_base_content},
        extra_content: oldData.extra_content 
      }
    })
  }
};

// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------

const MakeContentDiv = styled.div`
  
`;

const ClearButton = styled.button`
  
`;

const ManageContent = () => {
 
  const [currentAction, setCurrentAction] = useState(ActionTypes.Create);
  const [password, setPassword] = useState("");
  const [deleteData, setDeleteData] = useReducer(deleteReducer, deleteInitState);
  const [contentData, setContentData] = useReducer(contentReducer, contentInitState);
  const [updateOriginal, setUpdateOriginal] = useState<FullContent>();
 
  const ActionElement = {
    [ActionTypes.Create]: <ContentForm contentData={contentData} setContentData={setContentData} />,
    [ActionTypes.Update]: <UpdateForm contentData={contentData} setContentData={setContentData} setUpdateOriginal={setUpdateOriginal} />,
    [ActionTypes.Delete]: <DeleteForm deleteData={deleteData} setDeleteData={setDeleteData} />,
  };
  
  const clearFields = () => {
    setPassword("");
    setDeleteData(deleteInitState);
    setContentData(contentInitState);
  }
  
  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    switch (currentAction) {
      case ActionTypes.Create: createSubmit(contentData, password); break;
      case ActionTypes.Update: updateSubmit(contentData, updateOriginal, password); break;
      case ActionTypes.Delete: deleteSubmit(deleteData, password); break;
    }
  };
  
  return (
    <MakeContentDiv>
      <PageTitle>Manage Content</PageTitle>
      <ActionButtons currentAction={currentAction} setCurrent={setCurrentAction} />
      {ActionElement[currentAction]}
      <PasswordSubmit submitFunc={onSubmit} password={password} setPassword={setPassword} />
      <ClearButton onClick={clearFields}>
        Clear All Fields
      </ClearButton>
    </MakeContentDiv>
  )
}

export default ManageContent;
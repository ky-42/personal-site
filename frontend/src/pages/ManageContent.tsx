import React, { useReducer, useState } from "react";
import styled, { css } from "styled-components";

import PageTitle from "../components/PageTitle";
import { ActionTypes, ReducerAction, SetReducer, UpdateReducer } from "../types/ManageContent";
import { Blog, Content, ContentType, FullContent, Project, ProjectStatus } from "../types/Content";
import InputArea from "../components/ContentManagement/InputArea";
import { DropDown, InputGroup, InputSection, SectionTitle, ShortTextInput, StyledButton } from "../components/ContentManagement/InputElements";
import ProjectManagment from "../components/ContentManagement/ProjectManagment";
import BlogManagment from "../components/ContentManagement/BlogManagment";
import BaseContentManagment from "../components/ContentManagement/baseContentManagment";
import { ContentAdd, ContentPieceOperations } from "../adapters/content";
import { FullToNewFull } from "../types/HelperFuncs";
import { AiOutlineRight } from "react-icons/ai";
import { BasicInputStyling } from "../styles/InputStyling";
import { RequestState, RequestStatus } from "../types/RequestContent";

/* -------------------------------------------------------------------------- */

const ManageContentBody = styled.main`
  max-width: 1500px;
`;

/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */

var defaultExtraContent: ContentType = ContentType.Blog;

const defaultContent: Content = {
  id: 0,
  created_at: new Date(),
  updated_at: new Date(),
  content_type: defaultExtraContent,
  slug: "",
  title: "",
  content_desc: "",
  body: ""
};

const defaultBlog: Blog = {
  id: 0,
  content_type: ContentType.Blog,
  tags: []
}

const defaultProject: Project = {
  id: 0,
  content_type: ContentType.Project,
  current_status: ProjectStatus.UnderDevelopment
}

/* -------------------------------------------------------------------------- */

const contentReducer = <K extends keyof Content>(state: Content, action: SetReducer<Content> | UpdateReducer<Content, K>) => {
  switch (action.action) {
    case ReducerAction.Update:
      var newState = {...state};
      newState[action.field] = action.value;
      
      if (action.field === "title" && typeof action.value === "string") {
        newState.slug = action.value.replaceAll(" ", "-").toLocaleLowerCase();
      };
      
      return newState;
    case ReducerAction.Set:
      return action.newState;
  }
};

const blogReducer = <K extends keyof Blog>(state: Blog, action: SetReducer<Blog> | UpdateReducer<Blog, K>) => {
  switch (action.action) {
    case ReducerAction.Update:
      var newState = {...state};
      newState[action.field] = action.value;

      return newState;
    
    case ReducerAction.Set:
      return action.newState;
  }
};

const projectReducer = <K extends keyof Project>(state: Project, action: SetReducer<Project> | UpdateReducer<Project, K>) => {
  switch (action.action) {
    case ReducerAction.Update:
      var newState = {...state};
      newState[action.field] = action.value;

      return newState;
    
    case ReducerAction.Set:
      return action.newState;
  }
};

/* -------------------------------------------------------------------------- */

const ActionButton = styled.button<{active: Boolean}>`
  ${BasicInputStyling}
  ${props => props.active ? ActiveButton : UnactiveButton}
  width: 200px;
  font-size: 16px;
`;

const ActiveButton = css`
  color: ${props => props.theme.textColour};
  border: 1px solid ${props => props.theme.highlight};
`;

const UnactiveButton = css`
  border: 1px solid ${props => props.theme.darkTone};
  color: ${props => props.theme.lightTone};
`;

const InputButtonHolder = styled.div`
  display: flex;
`;

const EnterButton = styled(StyledButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin-left: 10px;
  height: 30px;
  width: 30px;
`;

/* -------------------------------------------------------------------------- */

const ManageContent = () => {

  const [currentAction, setCurrentAction] = useState(ActionTypes.Create);
  
  const [baseContentData, setBaseContentData] = useReducer(contentReducer, defaultContent);
  const [blogData, setBlogData] = useReducer(blogReducer, defaultBlog);
  const [projectData, setProjectData] = useReducer(projectReducer, defaultProject);
  
  const [modifySlug, setModifySlug] = useState("");
  
  const [extraContentType, setExtraContentType] = useState(defaultExtraContent);
  
  const [serverPassword, setServerPassword] = useState("");
  
  /* -------------------------------------------------------------------------- */
  
  const onSubmit = () => {
  
    var extraData: FullContent["extra_content"] = {"blog": blogData};

    switch (extraContentType) {
      case ContentType.Project:
        extraData = {"project": projectData};
        break; 
    }
    
    switch (currentAction) {
      case ActionTypes.Create:
        const addContent = FullToNewFull({
          base_content: baseContentData,
          extra_content: extraData
        });
        ContentAdd({
          addContent,
          password: serverPassword
        });
        break;

      case ActionTypes.Update:
        ContentPieceOperations({
          slug: modifySlug,
          method: "PUT",
          password: serverPassword,
          updated_content: {
            base_content: baseContentData,
            extra_content: extraData
          }
        })
        break;

      case ActionTypes.Delete:
        ContentPieceOperations({
          slug: modifySlug,
          method: "DELETE",
          password: serverPassword
        });
        break;
    }
  };

  /* -------------------------------------------------------------------------- */
  
  const loadOldContent = () => {
    ContentPieceOperations<FullContent>({
      slug: modifySlug,
      method: "GET"
    }).then((value) => {
      switch (value.requestStatus) {
        case RequestStatus.Success:
          setBaseContentData({
            action: ReducerAction.Set,
            newState: value.requestedData.base_content
          });
          
          if ("blog" in value.requestedData.extra_content) {
            setBlogData({
              action: ReducerAction.Set,
              newState: value.requestedData.extra_content["blog"]
            });
          } else if ("project" in value.requestedData.extra_content) {
            setProjectData({
              action: ReducerAction.Set,
              newState: value.requestedData.extra_content["project"]
            });
          }        

          break
      }
    })
  }
  

  /* -------------------------------------------------------------------------- */
  
  return (
    <ManageContentBody>
    
      <PageTitle>
        Manage Content
      </PageTitle>
      
      <InputSection>
        <SectionTitle>
          Action
        </SectionTitle>

        <InputGroup>
          <ActionButton active={currentAction===ActionTypes.Create} onClick={() => setCurrentAction(ActionTypes.Create)}>Create</ActionButton>
          <ActionButton active={currentAction===ActionTypes.Update} onClick={() => setCurrentAction(ActionTypes.Update)}>Update</ActionButton>
          <ActionButton active={currentAction===ActionTypes.Delete} onClick={() => setCurrentAction(ActionTypes.Delete)}>Delete</ActionButton>
        </InputGroup>

        {
          (currentAction == ActionTypes.Update || currentAction == ActionTypes.Delete) &&
          <InputGroup>
            <InputArea
              lableText={"Slug To " + currentAction + " (Enter to load data)"}
              InputElement={
                <InputButtonHolder>
                  <ShortTextInput
                    type="text"
                    value={modifySlug}
                    onChange={
                      e => setModifySlug(e.target.value)
                    }
                  />
                  <EnterButton 
                    onClick={loadOldContent}
                  >
                    <AiOutlineRight />
                  </EnterButton>
                </InputButtonHolder>
              }
            />
          </InputGroup>
        }

      </InputSection>

      <InputSection>
        <SectionTitle>
          Content Data
        </SectionTitle>
        
        <BaseContentManagment baseContentData={baseContentData} setBaseContentData={setBaseContentData} />

      </InputSection>
      
      <InputSection>
          
        <SectionTitle>
          Extra Content
        </SectionTitle>

        <InputArea
          lableText={"Content Type"}
          InputElement={
            <DropDown
              value={extraContentType}
              onChange={e => setExtraContentType(e.target.value as ContentType)}
            >
              <option value={ContentType.Blog}>Blog</option>
              <option value={ContentType.Project}>Project</option>
            </DropDown>
          }
        />
        
        {
          extraContentType === ContentType.Blog &&
          <BlogManagment blogData={blogData} setBlogData={setBlogData} />
        }
        {
          extraContentType === ContentType.Project &&
          <ProjectManagment projectData={projectData} setProjectData={setProjectData} />
        }

      </InputSection>
      
      <InputSection>
      
        <SectionTitle>
          Authentication
        </SectionTitle>

        <InputArea 
          lableText={"Server Password"}
          InputElement={
            <ShortTextInput
              type="password"
              value={serverPassword}
              onChange={
                e => setServerPassword(e.target.value)
              }
            />
          }
        />
      </InputSection>
      
      <InputSection>
      
        <SectionTitle>
          Submit
        </SectionTitle>
        
        <InputArea 
          lableText={currentAction + " Above content"}
          InputElement={
            <StyledButton
              onClick={onSubmit}
            >
              Submit
            </StyledButton>
          }
        />
        
      </InputSection>

    </ManageContentBody>
  )
}  

export default ManageContent;

// import styled from "styled-components";

// import { ActionTypes, DeleteState, NewContentFeilds } from "../types/ManageContent";
// import PageTitle from "../components/PageTitle";
// import ActionButtons from "../components/ContentManagement/ActionButtons";
// import ContentForm from "../components/ContentManagement/ContentForm";
// import DeleteForm from "../components/ContentManagement/DeleteForm";
// import PasswordSubmit from "../components/ContentManagement/PasswordSubmit";
// import { ContentType, FullContent, NewBlog, NewContent, NewFullContent, NewProject } from "../types/Content";
// import UpdateForm from "../components/ContentManagement/UpdateForm";
// import { ContentAdd, GetContentPiece } from "../adapters/content";

// // --------------------------------------------------------------------------------------------------

// const deleteInitState: DeleteState = {
//   deleteSlug: ""
// };

// const isDeleteState = (obj: any): obj is DeleteState => {
//   return obj.deleteSlug !== undefined; 
// }

// const deleteReducer = <K extends keyof DeleteState>(state: DeleteState, action: {field: K, value: DeleteState[K]} | DeleteState ) => {
//   if (isDeleteState(action)) {
//     return action;
//   };

//   return {...state, [action.field]: action.value}
// };

// const deleteSubmit = (deleteData: DeleteState, password: string) => {
//   GetContentPiece({
//     slug: deleteData.deleteSlug,
//     method: "DELETE",
//     password
//   });
// };

// // --------------------------------------------------------------------------------------------------
// // --------------------------------------------------------------------------------------------------


// const extraBlogInit: NewFullContent["new_extra_content"] = {
//   "blog": {}
// } 

// const extraProjectInit: NewFullContent["new_extra_content"] = {
//   "project": {
//     current_status: "under_development"
//   }
// } 

// const contentInitState: NewFullContent = {
//   new_base_content: {
//     content_type: ContentType.Blog,
//     slug: "",
//     title: "",
//     body: "",
//   },
//   new_extra_content: extraBlogInit 
// };

// const isNewFullContent = (obj: any): obj is NewFullContent => {
//   return obj.new_base_content !== undefined; 
// }

// const isContentType = (obj: any): obj is ContentType => {
//   return obj == "blog" || obj == "project";
// }

// const contentReducer = (state: NewFullContent, action: {key: keyof NewContentFeilds, value: NewContentFeilds[keyof NewContentFeilds], extra?: ContentType} | NewFullContent) => {

//   // I hate typescript of this mess
//   // TODO fix this typescript shit
  
//   if (isNewFullContent(action)) {
//     return action;
//   }
  
//   let {new_base_content, new_extra_content} = state;
  
//   switch (action.extra) {
//     case ContentType.Project:
//       if ("project" in new_extra_content) {
//         new_extra_content.project[action.key as keyof NewProject] = action.value as NewProject[keyof NewProject];
//       }
//       break;
//     case ContentType.Blog:
//       if ("blog" in new_extra_content) {
//         new_extra_content.blog[action.key as keyof NewBlog] = action.value as NewBlog[keyof NewBlog];
//       }
//       break;
//     default:
    
//       if (isContentType(action.value) || action.key == "content_type") {
//         new_base_content["content_type"] = action.value === "project" ? ContentType.Project : ContentType.Blog;
//       } else {
//         new_base_content[action.key as keyof NewContent] = action.value as string;
//       }
//       // TODO remove as string on line below
//       if (action.key === "title" && typeof action.value === "string") {
//         new_base_content.slug = action.value.replaceAll(" ", "-").toLocaleLowerCase();   
//       };
//       if (action.key === "content_type") {
//         if (action.value === "project") {
//           new_extra_content = extraProjectInit;
//         } else {
//           new_extra_content = extraBlogInit;
//         }
//       }

//       break;
//   };

//   let newState: NewFullContent = {
//     new_base_content,
//     new_extra_content
//   };

//   return newState;
// };

// const createSubmit = (createData: NewFullContent, password: string) => {
//   ContentAdd({
//     addContent: createData,
//     password
//   })
// };

// const updateSubmit = (updateData: NewFullContent, oldData: FullContent | undefined, password: string) => {
//   // TODO let user update extra_content
//   if (oldData !== undefined) {
//     GetContentPiece({
//       slug: oldData.base_content.slug,
//       method: "PUT",
//       password,
//       updated_content: {
//         base_content: {...oldData.base_content, ...updateData.new_base_content},
//         extra_content: oldData.extra_content 
//       }
//     })
//   }
// };

// // --------------------------------------------------------------------------------------------------
// // --------------------------------------------------------------------------------------------------

// const MakeContentDiv = styled.div`
  
// `;

// const ClearButton = styled.button`
  
// `;

// const ManageContent = () => {
 
  // const [currentAction, setCurrentAction] = useState(ActionTypes.Create);
  // const [password, setPassword] = useState("");
  // const [deleteData, setDeleteData] = useReducer(deleteReducer, deleteInitState);
  // const [contentData, setContentData] = useReducer(contentReducer, contentInitState);
  // const [updateOriginal, setUpdateOriginal] = useState<FullContent>();
 
  // const ActionElement = {
  //   [ActionTypes.Create]: <ContentForm contentData={contentData} setContentData={setContentData} />,
  //   [ActionTypes.Update]: <UpdateForm contentData={contentData} setContentData={setContentData} setUpdateOriginal={setUpdateOriginal} />,
  //   [ActionTypes.Delete]: <DeleteForm deleteData={deleteData} setDeleteData={setDeleteData} />,
  // };
  
  // const clearFields = () => {
  //   setPassword("");
  //   setDeleteData(deleteInitState);
  //   setContentData(contentInitState);
  // }
  
  // const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
  //   e.preventDefault();
  //   switch (currentAction) {
  //     case ActionTypes.Create: createSubmit(contentData, password); break;
  //     case ActionTypes.Update: updateSubmit(contentData, updateOriginal, password); break;
  //     case ActionTypes.Delete: deleteSubmit(deleteData, password); break;
  //   }
  // };
  
  // return (
  //   <MakeContentDiv>
  //     <PageTitle>Manage Content</PageTitle>
  //     <ActionButtons currentAction={currentAction} setCurrent={setCurrentAction} />
  //     {ActionElement[currentAction]}
  //     <PasswordSubmit submitFunc={onSubmit} password={password} setPassword={setPassword} />
  //     <ClearButton onClick={clearFields}>
  //       Clear All Fields
  //     </ClearButton>
  //   </MakeContentDiv>
  // )
// }

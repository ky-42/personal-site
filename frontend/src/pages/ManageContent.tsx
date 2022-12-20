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
import { RequestStatus } from "../types/RequestContent";

/* -------------------------------------------------------------------------- */

const ManageContentBody = styled.main`
  max-width: 1500px;
`;

/* -------------------- Default values used in component -------------------- */

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

/* ---------------------------- Reducer function ---------------------------- */

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

/* ----------------------------- Styled Elements ---------------------------- */

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

  // Action to be performed on server
  const [currentAction, setCurrentAction] = useState(ActionTypes.Create);
  
  // Form state
  const [baseContentData, setBaseContentData] = useReducer(contentReducer, defaultContent);
  const [blogData, setBlogData] = useReducer(blogReducer, defaultBlog);
  const [projectData, setProjectData] = useReducer(projectReducer, defaultProject);
  
  // Slug to be updated or deleted
  const [modifySlug, setModifySlug] = useState("");
  
  const [extraContentType, setExtraContentType] = useState(defaultExtraContent);
  
  const [serverPassword, setServerPassword] = useState("");
  
  /* -------------------------------------------------------------------------- */
  
  // How to submit the form
  const onSubmit = () => {
  
    // Sets up extra content data to be put into FullContent object
    var extraData: FullContent["extra_content"] = {"blog": blogData};

    switch (extraContentType) {
      case ContentType.Project:
        extraData = {"project": projectData};
        break; 
    }
    
    switch (currentAction) {
      case ActionTypes.Create:

        // Converts the full content object to a new full content object
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
  
  // Loads the content to be updated or deleted
  const loadOldContent = () => {
    ContentPieceOperations<FullContent>({
      slug: modifySlug,
      method: "GET"
    }).then((value) => {
      switch (value.requestStatus) {
        // TODO add success messages and error handling
        case RequestStatus.Success:
          // Sets the base content state
          setBaseContentData({
            action: ReducerAction.Set,
            newState: value.requestedData.base_content
          });
          
          // Sets the extra content state
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

          break;
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
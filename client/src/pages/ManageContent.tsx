import React, { useReducer, useRef, useState } from "react";
import styled from "styled-components";
import { AiOutlineRight } from "react-icons/ai";

import PageTitle from "../components/Shared/PageTitle";
import { ActionTypes, ReducerAction, SetReducer, UpdateReducer } from "../types/ManageContent";
import { Blog, Content, ContentType, FullContent, NewFullContent, Project, ProjectStatus } from "../types/Content";
import InputArea from "../components/ContentManagement/InputArea";
import { ClickButton, DropDown, EnterButton, InputGroup, InputSection, SectionTitle, ShortTextInput, StateButton, StyledButton } from "../components/ContentManagement/InputElements";
import ProjectManagment from "../components/ContentManagement/ProjectManagment";
import BaseContentManagment from "../components/ContentManagement/BaseContentManagment";
import BlogManagment from "../components/ContentManagement/BlogManagment";
import { ContentAdd, ContentPieceOperations } from "../adapters/content";
import { blogToNew, contentToNew, projectToNew } from "../types/HelperFuncs";
import { RequestStatus } from "../types/RequestContent";
import { validateBlog, validateContent, validateProject } from "../components/ContentManagement/InputValidation";

/* -------------------------------------------------------------------------- */

const ManageContentBody = styled.main`
  margin: auto;
  max-width: 150.0rem;
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

const InputButtonHolder = styled.div`
  display: flex;
`;

/* -------------------------------------------------------------------------- */

const ManageContent = () => {

  // Action to be performed on server
  const [currentAction, setCurrentAction] = useState(ActionTypes.Create);
  
  // Form state
  const [baseContentData, setBaseContentData] = useReducer(contentReducer, defaultContent);
  const [blogData, setBlogData] = useReducer(blogReducer, defaultBlog);
  const [projectData, setProjectData] = useReducer(projectReducer, defaultProject);
  
  // Key in the record will be keys of content, blog, or project
  // Done this way because we dont need all keys from those types in the object
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Needed so when there are validation errors page can scroll to top
  const pageTop = useRef<HTMLHeadingElement>(null);
  
  // Slug to be updated or deleted
  const [modifySlug, setModifySlug] = useState("");
  
  const [extraContentType, setExtraContentType] = useState(defaultExtraContent);
  
  const [serverPassword, setServerPassword] = useState("");
  
  /* -------------------------------------------------------------------------- */
  
  // How to submit the form
  const onSubmit = () => {
    
    /* ---------- Validates data and sets up data to be sent in request --------- */
    
    let newValidationErrors = {}; 
    
    let baseNewData = contentToNew(baseContentData);
    validateContent(baseNewData, newValidationErrors);
    let baseData = {...baseContentData, ...baseNewData};

    // Sets up extra content data objects
    let extraData: FullContent["extra_content"];
    let extraNewData: NewFullContent["new_extra_content"];
    
    switch (extraContentType) {
      case ContentType.Blog:
        extraNewData = {"blog": blogToNew(blogData)};
        validateBlog(extraNewData.blog, newValidationErrors);
        extraData = {"blog": {...blogData, ...extraNewData["blog"]}};
        break;
        
      case ContentType.Project:
        extraNewData = {"project": projectToNew(projectData)};
        validateProject(extraNewData.project, newValidationErrors);
        extraData = {"project": {...projectData, ...extraNewData["project"]}};
        break; 
    }

    setValidationErrors(newValidationErrors);
    
    // If there are errors scroll to top stop request
    if (Object.keys(newValidationErrors).length !== 0) {
      pageTop.current?.scrollIntoView();
      return;
    }

    /* -------------------------------------------------------------------------- */
    
    switch (currentAction) {
      case ActionTypes.Create:

        const addContent = {
          new_base_content: baseNewData,
          new_extra_content: extraNewData
        };

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
            base_content: baseData,
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
            setExtraContentType(ContentType.Blog);
            setBlogData({
              action: ReducerAction.Set,
              newState: value.requestedData.extra_content["blog"]
            });
          } else if ("project" in value.requestedData.extra_content) {
            setExtraContentType(ContentType.Project);
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
  
  const clearContent = () => {
    setBaseContentData({
      action: ReducerAction.Set,
      newState: defaultContent
    });
    
    setExtraContentType(defaultExtraContent);

    setBlogData({
      action: ReducerAction.Set,
      newState: defaultBlog
    });
    
    setProjectData({
      action: ReducerAction.Set,
      newState: defaultProject
    });
  }
  
  /* -------------------------------------------------------------------------- */
  
  return (
    <ManageContentBody>
      <div ref={pageTop}></div>
    
      <PageTitle>
        Manage Content
      </PageTitle>
      
      <InputSection>
        <SectionTitle>
          Action
        </SectionTitle>

        <InputGroup>
          <StateButton active={currentAction===ActionTypes.Create} onClick={() => setCurrentAction(ActionTypes.Create)}>Create</StateButton>
          <StateButton active={currentAction===ActionTypes.Update} onClick={() => setCurrentAction(ActionTypes.Update)}>Update</StateButton>
          <StateButton active={currentAction===ActionTypes.Delete} onClick={() => setCurrentAction(ActionTypes.Delete)}>Delete</StateButton>
          <ClickButton onClick={() => clearContent()}>Clear</ClickButton>
        </InputGroup>

        {
          (currentAction === ActionTypes.Update || currentAction === ActionTypes.Delete) &&
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
        
        <BaseContentManagment baseContentData={baseContentData} setBaseContentData={setBaseContentData} validationErrors={validationErrors} />

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
          <BlogManagment blogData={blogData} setBlogData={setBlogData} validationErrors={validationErrors} />
        }
        {
          extraContentType === ContentType.Project &&
          <ProjectManagment projectData={projectData} setProjectData={setProjectData} validationErrors={validationErrors} />
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
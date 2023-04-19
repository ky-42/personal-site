import { useContext, useReducer, useRef, useState } from "react";
import styled from "styled-components";
import { AiOutlineRight } from "react-icons/ai";

import PageTitle from "../components/Shared/PageTitle";
import { ActionTypes, ReducerAction, SetReducer, UpdateReducer } from "../types/ManageContent";
import { Blog, Content, ContentType, Devblog, FullContent, NewDevblog, NewFullContent, Project, ProjectStatus } from "../types/Content";
import InputArea from "../components/ContentManagement/InputArea";
import { ClickButton, DropDown, EnterButton, InputButtonHolder, InputGroup, InputSection, SectionTitle, ShortTextInput, SmallSectionTitle, StateButton, StyledButton } from "../components/ContentManagement/InputElements";
import ProjectManagment from "../components/ContentManagement/ProjectManagment";
import BaseContentManagment from "../components/ContentManagement/BaseContentManagment";
import BlogManagment from "../components/ContentManagement/BlogManagment";
import { ContentOperations, DevblogOperations, TagOperations } from "../adapters/content";
import { blogToNew, contentToNew, devblogToNew, projectToNew } from "../types/HelperFuncs";
import { RequestStatus } from "../types/RequestContent";
import { validateBlog, validateContent, validateDevblog, validateProject } from "../components/ContentManagement/InputValidation";
import DevblogManagement from "../components/ContentManagement/DevblogManagement";
import { NotificationContext, NotificationType } from "../contexts/Notification";

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
}

const defaultProject: Project = {
  id: 0,
  content_type: ContentType.Project,
  current_status: ProjectStatus.UnderDevelopment
}

const defaultDevblog: Devblog = {
  id: 0,
  title: ""  
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

const devblogReducer = <K extends keyof Devblog>(state: Devblog, action: SetReducer<Devblog> | UpdateReducer<Devblog, K>) => {
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

const ManageContent = () => {

  const notifications = useContext(NotificationContext);

  // Action to be performed on server
  const [currentAction, setCurrentAction] = useState(ActionTypes.Create);
  
  // Slug or title to be updated or deleted
  const [modifyItem, setModifyItem] = useState("");

  // Content form state
  const [baseContentData, setBaseContentData] = useReducer(contentReducer, defaultContent);
  const [blogData, setBlogData] = useReducer(blogReducer, defaultBlog);
  const [projectData, setProjectData] = useReducer(projectReducer, defaultProject);
  
  const [extraContentType, setExtraContentType] = useState(defaultExtraContent);
  
  // Tags for blog
  const [tags, setTags] = useState<Set<string>>(new Set());

  // Devblog form state
  const [devblogData, setDevblogData] = useReducer(devblogReducer, defaultDevblog);

  const [serverPassword, setServerPassword] = useState("");

  // Key in the record will be keys of content, blog, devblog, or project
  // Done this way because we dont need all keys from those types in the object
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Needed so when there are validation errors page can scroll to top
  const pageTop = useRef<HTMLHeadingElement>(null);
  
  /* -------------------------------------------------------------------------- */
  
  // How to submit the form
  const onSubmit = () => {

    let newValidationErrors = {}; 

    switch (currentAction) {
      case ActionTypes.Create: 
      case ActionTypes.Update:
      case ActionTypes.Delete:
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
          
          notifications.addNotification({
            message: "There are errors in the form",
            type: NotificationType.Error
          });
          
          return;
        }
        
        submitContent({baseData, baseNewData, extraData, extraNewData});
        
        break;

      case ActionTypes.DevblogCreate:
      case ActionTypes.DevblogUpdate:
      case ActionTypes.DevblogDelete:
      
        let devblogNewData = devblogToNew(devblogData);
        validateDevblog(devblogNewData, newValidationErrors);

        setValidationErrors(newValidationErrors);
        
        // If there are errors scroll to top stop request
        if (Object.keys(newValidationErrors).length !== 0) {
          pageTop.current?.scrollIntoView();

          notifications.addNotification({
            message: "There are errors in the form",
            type: NotificationType.Error
          });

          return;
        }
      
        submitDevblog({submitDevblogData: devblogData, devblogNewData});
        break;
    }
  }
  
  interface SubmitContentParams {
    baseData: FullContent["base_content"];
    baseNewData: NewFullContent["new_base_content"];
    extraData: FullContent["extra_content"];
    extraNewData: NewFullContent["new_extra_content"];
  }

  const submitContent = ({baseData, baseNewData, extraData, extraNewData}: SubmitContentParams) => {
    
    /* ---------- Validates data and sets up data to be sent in request --------- */
    
    switch (currentAction) {
      case ActionTypes.Create:

        const addContent = {
          new_base_content: baseNewData,
          new_extra_content: extraNewData
        };

        ContentOperations.add_content({
          addContent,
          password: serverPassword
        }).then((base_content_request) => {

          switch (base_content_request.requestStatus) {
            case (RequestStatus.Success):

              if (extraContentType === ContentType.Blog) {
                TagOperations.add_tags({
                  blog_slug: baseNewData.slug,
                  tags: Array.from(tags),
                  password: serverPassword
                }).then((tag_request) => {

                  switch (tag_request.requestStatus) {
                    case (RequestStatus.Success):
                      notifications.addNotification({
                        message: "Content added successfully",
                        type: NotificationType.Success
                      });
                      break;
                    
                    default:
                      notifications.addNotification({
                        message: "Error adding tags. Delete content and try again",
                        type: NotificationType.Error
                      });
                      
                      console.log(tag_request);
                      break;
                  }

                });
              } else {
                notifications.addNotification({
                  message: "Content added successfully",
                  type: NotificationType.Success
                });
              };
              break;
            
            default:
              notifications.addNotification({
                message: "Error adding content",
                type: NotificationType.Error
              });
              
              console.log(base_content_request);
              break;
          }

        });
        break;

      case ActionTypes.Update:
        ContentOperations.update_content({
          slug: modifyItem,
          password: serverPassword,
          updated_content: {
            base_content: baseData,
            extra_content: extraData
          }
        }).then((base_content_request) => {

          switch (base_content_request.requestStatus) {
            case (RequestStatus.Success):
              // After updating content, update tags needed then so there is no race condition
              if (extraContentType === ContentType.Blog) {
                TagOperations.delete_tags({
                  blog_slug: baseData.slug,
                  password: serverPassword
                }).then((tag_delete_request) => {

                  switch (tag_delete_request.requestStatus) {
                    case RequestStatus.Success:
                      TagOperations.add_tags({
                        blog_slug: baseNewData.slug,
                        tags: Array.from(tags),
                        password: serverPassword
                      }).then((tag_add_request) => {

                        switch (tag_add_request.requestStatus) {
                          case RequestStatus.Success:
                            notifications.addNotification({
                              message: "Content updated successfully",
                              type: NotificationType.Success
                            });
                            break;
                          
                          case RequestStatus.Error:
                          case RequestStatus.Loading:
                            notifications.addNotification({
                              message: "Error updating tags. Old tags deleted by new tags added try reupdating content",
                              type: NotificationType.Error
                            });

                            console.log(tag_add_request);
                            break;
                        }

                      });
                      break;
                    
                    case RequestStatus.Error:
                    case RequestStatus.Loading:
                      notifications.addNotification({
                        message: "Error updating tags. Old tags still exist try reupdating content",
                        type: NotificationType.Error
                      });

                      console.log(tag_delete_request);
                      break;
                  }

                })
              } else {
                notifications.addNotification({
                  message: "Content updated successfully",
                  type: NotificationType.Success
                });
              }
              break;
            
            case RequestStatus.Error:
            case RequestStatus.Loading:
              notifications.addNotification({
                message: "Error updating content",
                type: NotificationType.Error
              });
              
              console.log(base_content_request);
              break;
          }

        });
        break;

      case ActionTypes.Delete:

        ContentOperations.delete_content({
          slug: modifyItem,
          password: serverPassword
        }).then((base_content_request) => {

          switch (base_content_request.requestStatus) {
            case RequestStatus.Success:
              notifications.addNotification({
                message: "Content deleted successfully",
                type: NotificationType.Success
              });
              break;
            
            case RequestStatus.Error:
            case RequestStatus.Loading:
              notifications.addNotification({
                message: "Error deleting content",
                type: NotificationType.Error
              });
              
              console.log(base_content_request);
              break;
          }

        });
        break;
    }
  };

  interface submitDevblogParams {
    submitDevblogData: Devblog;
    devblogNewData: NewDevblog;
  }

  const submitDevblog = ({submitDevblogData: devblogData, devblogNewData}: submitDevblogParams) => {
    switch (currentAction) {
      case ActionTypes.DevblogCreate:
        DevblogOperations.add_devblog({
          newDevblogInfo: devblogNewData,
          password: serverPassword
        }).then((devblog_add_request) => {

          switch (devblog_add_request.requestStatus) {
            case RequestStatus.Success:
              notifications.addNotification({
                message: "Devblog added successfully",
                type: NotificationType.Success
              });
              break;
            
            case RequestStatus.Error:
            case RequestStatus.Loading:
              notifications.addNotification({
                message: "Error adding devblog",
                type: NotificationType.Error
              });
              
              console.log(devblog_add_request);
              break;
          }

        });
        break;

      case ActionTypes.DevblogUpdate:
        DevblogOperations.update_devblog({
          title: modifyItem,
          password: serverPassword,
          updatedDevblogInfo: devblogData
        }).then((devblog_update_request) => {

          switch (devblog_update_request.requestStatus) {
            case RequestStatus.Success:
              notifications.addNotification({
                message: "Devblog updated successfully",
                type: NotificationType.Success
              });
              break;
            
            case RequestStatus.Error:
            case RequestStatus.Loading:
              notifications.addNotification({
                message: "Error updating devblog",
                type: NotificationType.Error
              });
              
              console.log(devblog_update_request);
              break;
          }

        });
        break;

      case ActionTypes.DevblogDelete:
        DevblogOperations.delete_devblog({
          title: modifyItem,
          password: serverPassword
        }).then((devblog_delete_request) => {

          switch (devblog_delete_request.requestStatus) {
            case RequestStatus.Success:
              notifications.addNotification({
                message: "Devblog deleted successfully",
                type: NotificationType.Success
              });
              break;
            
            case RequestStatus.Error:
            case RequestStatus.Loading:
              notifications.addNotification({
                message: "Error deleting devblog",
                type: NotificationType.Error
              });
              
              console.log(devblog_delete_request);
              break;
          }

        });
        break;
    }
  };

  /* -------------------------------------------------------------------------- */
  
  // Loads the content to be updated or deleted
  const loadOldContent = () => {
  
    switch (currentAction) {
      case ActionTypes.Update:
      case ActionTypes.Delete:
        ContentOperations.get_content({
          slug: modifyItem
        }).then((base_content_request) => {

          switch (base_content_request.requestStatus) {
            case RequestStatus.Success:
              // Sets the base content state
              setBaseContentData({
                action: ReducerAction.Set,
                newState: base_content_request.requestedData.base_content
              });
              
              // Sets the extra content state
              if ("blog" in base_content_request.requestedData.extra_content) {
                setExtraContentType(ContentType.Blog);
                setBlogData({
                  action: ReducerAction.Set,
                  newState: base_content_request.requestedData.extra_content["blog"]
                });

                // Gets the tags for the blog because they are not in the blog data
                TagOperations.get_blog_tags({
                  blog_slug: base_content_request.requestedData.base_content.slug
                }).then((tag_request) => {

                  switch (tag_request.requestStatus) {
                    case RequestStatus.Success:
                      if (tag_request.requestStatus === RequestStatus.Success) {
                        setTags(new Set(Array.from(tag_request.requestedData).map((tag) => tag.title)));
                      };
                      
                      notifications.addNotification({
                        message: "Old content loaded successfully",
                        type: NotificationType.Success
                      });

                      break;
                    
                    case RequestStatus.Error:
                    case RequestStatus.Loading:
                      notifications.addNotification({
                        message: "Error loading old tags. Try again",
                        type: NotificationType.Error
                      });

                      console.log(tag_request);
                      break;
                  }

                });

              } else if ("project" in base_content_request.requestedData.extra_content) {
                setExtraContentType(ContentType.Project);
                setProjectData({
                  action: ReducerAction.Set,
                  newState: base_content_request.requestedData.extra_content["project"]
                });
                
                notifications.addNotification({
                  message: "Old content loaded successfully",
                  type: NotificationType.Success
                });
              }        

              break;
            
            case RequestStatus.Error:
            case RequestStatus.Loading:
              notifications.addNotification({
                message: "Error loading old content",
                type: NotificationType.Error
              });
              
              console.log(base_content_request);
              break;
          }

        });
        break;
      
      case ActionTypes.DevblogUpdate:
      case ActionTypes.DevblogDelete:
        DevblogOperations.get_devblog_object({
          title: modifyItem
        }).then((devblog_request) => {
          switch (devblog_request.requestStatus) {
            case RequestStatus.Success:
              // Sets the devblog state
              setDevblogData({
                action: ReducerAction.Set,
                newState: devblog_request.requestedData
              });
              
              notifications.addNotification({
                message: "Old devblog loaded successfully",
                type: NotificationType.Success
              });
              
              break;
            
            case RequestStatus.Error:
            case RequestStatus.Loading:
              notifications.addNotification({
                message: "Error loading old devblog",
                type: NotificationType.Error
              });
              
              console.log(devblog_request);
              break;
          }
        });
    }
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
    
    setTags(new Set());
    
    setProjectData({
      action: ReducerAction.Set,
      newState: defaultProject
    });
    
    setDevblogData({
      action: ReducerAction.Set,
      newState: defaultDevblog
    });
    
    notifications.addNotification({
      message: "Content cleared",
      type: NotificationType.Info
    });
  }
  
  /* -------------------------------------------------------------------------- */
  
  let ContentManagerForm = (
    <>
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
          <BlogManagment blogData={blogData} setBlogData={setBlogData} tags={tags} setTags={setTags} validationErrors={validationErrors} />
        }
        {
          extraContentType === ContentType.Project &&
          <ProjectManagment projectData={projectData} setProjectData={setProjectData} validationErrors={validationErrors} />
        }

      </InputSection>
    </>
  );
  
  let DevblogManagerForm = (
    <InputSection>

      <SectionTitle>
        Devblog Data
      </SectionTitle>
      
      <DevblogManagement devblogData={devblogData} setDevblogData={setDevblogData} validationErrors={validationErrors} />

    </InputSection>
  );
  
  let CurrentForm;

  if (
    currentAction === ActionTypes.Create ||
    currentAction === ActionTypes.Update ||
    currentAction === ActionTypes.Delete
  ) {
    CurrentForm = ContentManagerForm;
  } else if (
    currentAction === ActionTypes.DevblogCreate ||
    currentAction === ActionTypes.DevblogUpdate ||
    currentAction === ActionTypes.DevblogDelete
  ) {
    CurrentForm = DevblogManagerForm;
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
          <SmallSectionTitle>Content Operations</SmallSectionTitle>
          <InputGroup>
            <StateButton active={currentAction===ActionTypes.Create} onClick={() => setCurrentAction(ActionTypes.Create)}>Create</StateButton>
            <StateButton active={currentAction===ActionTypes.Update} onClick={() => setCurrentAction(ActionTypes.Update)}>Update</StateButton>
            <StateButton active={currentAction===ActionTypes.Delete} onClick={() => setCurrentAction(ActionTypes.Delete)}>Delete</StateButton>
          </InputGroup>
          <SmallSectionTitle>Devblog Operations</SmallSectionTitle>
          <InputGroup>
            <StateButton active={currentAction===ActionTypes.DevblogCreate} onClick={() => setCurrentAction(ActionTypes.DevblogCreate)}>Create Devblog</StateButton>
            <StateButton active={currentAction===ActionTypes.DevblogUpdate} onClick={() => setCurrentAction(ActionTypes.DevblogUpdate)}>Update Devblog</StateButton>
            <StateButton active={currentAction===ActionTypes.DevblogDelete} onClick={() => setCurrentAction(ActionTypes.DevblogDelete)}>Delete Devblog</StateButton>
          </InputGroup>
          <SmallSectionTitle>Form Operations</SmallSectionTitle>
          <InputGroup>
            <ClickButton onClick={() => clearContent()}>Clear Form</ClickButton>
          </InputGroup>
        </InputGroup>

        {
          (
            currentAction === ActionTypes.Update ||
            currentAction === ActionTypes.Delete ||
            currentAction === ActionTypes.DevblogUpdate ||
            currentAction === ActionTypes.DevblogDelete
          ) &&
          <InputGroup>
            <InputArea
              lableText={
                currentAction === ActionTypes.Update || currentAction === ActionTypes.Delete ?
                `Slug To ${currentAction} (Enter to load data)` :
                `Devblog Title To ${currentAction.split(" ").splice(-1)} (Enter to load data)`
              }
              InputElement={
                <InputButtonHolder>
                  <ShortTextInput
                    type="text"
                    value={modifyItem}
                    onChange={
                      e => setModifyItem(e.target.value)
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
      
      {
        CurrentForm
      }

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
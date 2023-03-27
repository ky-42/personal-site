import React from "react";
import styled from "styled-components";

import { Project, ProjectStatus } from "../../types/Content";
import { ReducerAction, SetReducer, UpdateReducer } from "../../types/ManageContent";
import { DateInput, DropDown, InputGroup, ShortTextInput } from "./InputElements";
import InputArea from "./InputArea";

/* -------------------------------------------------------------------------- */

const ProjectManagmentArea = styled.div``;

/* -------------------------------------------------------------------------- */

interface projectManagmentProps {
  projectData: Project,
  setProjectData: React.Dispatch<
    SetReducer<Project> | UpdateReducer<Project, keyof Project>
  >,
  // Possiable errors in an input with key being feild and value being error message
  validationErrors: Record<string, string>
}

// Form part for inputing data about the project specific parts of content
const ProjectManagment = ({projectData, setProjectData, validationErrors}: projectManagmentProps) => {
  
  return (
    <ProjectManagmentArea>
      <InputArea
        lableText={"Project Status"}
        error={validationErrors["current_status"]}
        InputElement={
          <DropDown
            value={projectData.current_status}
            onChange={
              e => setProjectData({
                action: ReducerAction.Update,
                field: "current_status",
                value: e.target.value as ProjectStatus
              })
            }
          >
            <option value={ProjectStatus.UnderDevelopment}>Under Development</option>
            <option value={ProjectStatus.Finished}>Finished</option>
          </DropDown>
        }
      />
      
      <InputGroup>
        <InputArea 
          lableText={"Github Link"}
          error={validationErrors["github_link"]}
          InputElement={
            <ShortTextInput
              type="text"
              placeholder="https://github.com/ky-42/personal-site"
              value={projectData.github_link ? projectData.github_link : ""}
              onChange={
                e => setProjectData({
                  action: ReducerAction.Update,
                  field: "github_link",
                  value: e.target.value
                })
              }
            />
          }
        />
        
        <InputArea 
          lableText={"Website Link"}
          error={validationErrors["url"]}
          InputElement={
            <ShortTextInput
              type="text"
              placeholder="https://kyledenief.me/"
              value={projectData.url ? projectData.url : ""}
              onChange={
                e => setProjectData({
                  action: ReducerAction.Update,
                  field: "url",
                  value: e.target.value
                })
              }
            />
          }
        />
        
        <InputArea
          lableText={"Project Start Date"}
          error={validationErrors["start_date"]}
          InputElement={
            <DateInput
              type="date"
              value={projectData.start_date ? projectData.start_date.toISOString().slice(0, 10) : new Date().toDateString()}
              onChange={
                e => setProjectData({
                  action: ReducerAction.Update,
                  field: "start_date",
                  value: new Date(e.target.value)
                })
              }
            />
          }
        />
      </InputGroup>
    </ProjectManagmentArea>
  )
}

export default ProjectManagment;
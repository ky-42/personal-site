import React from "react";
import styled from "styled-components";

import { Project, ProjectStatus } from "../../types/Content";
import { ReducerAction, SetReducer, UpdateReducer } from "../../types/ManageContent";
import { DropDown } from "./InputElements";
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
    </ProjectManagmentArea>
  )
}

export default ProjectManagment;
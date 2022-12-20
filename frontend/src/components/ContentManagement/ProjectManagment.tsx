import React from "react";
import styled from "styled-components";

import { Project, ProjectStatus } from "../../types/Content";
import { ReducerAction, SetReducer, UpdateReducer } from "../../types/ManageContent";
import { DropDown } from "./InputElements";
import InputArea from "./InputArea";

const ProjectManagmentArea = styled.div``;

interface projectManagmentProps {
  projectData: Project,
  setProjectData: React.Dispatch<
    SetReducer<Project> | UpdateReducer<Project, keyof Project>
  >
}

const ProjectManagment = ({projectData, setProjectData}: projectManagmentProps) => {
  
  return (
    <ProjectManagmentArea>
      <InputArea
        lableText={"Project Status"}
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
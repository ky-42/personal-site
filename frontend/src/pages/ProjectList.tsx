import React from "react";
import styled from "styled-components";
import { isMobile } from "react-device-detect";

import PageTitle from "../styledComponents/PageTitle";
import VerticalListContainer from "../components/VerticalListContainer";

const ProjectListDiv = styled.div`
  
`;

const ProjectList = () => {
  return (
    <ProjectListDiv>
      <PageTitle>
        My Projects 
      </PageTitle>
      <VerticalListContainer />
      <VerticalListContainer />
      <VerticalListContainer />
    </ProjectListDiv>
  )
}

export default ProjectList;
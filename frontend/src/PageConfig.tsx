import React from "react";
import styled from "styled-components";
import NavBar from "./components/NavBar/NavBar";
import Routing from "./Routing";

const BodyDiv = styled.div`
  width: 100vw;
  height: calc(100vh - calc(${props => props.theme.navHeight} + ${props => props.theme.borderSize}*2));
  overflow-y: scroll;
`;

const SideMargin = styled.div`
  --margin-sides: clamp(1.35rem, 6vw, 10rem);
  margin: 0 var(--margin-sides);
`;

const PageConfig = () => {
  return (
    <>
      <BodyDiv>
        <SideMargin>
          <Routing />
        </SideMargin>
      </BodyDiv>
      <NavBar />
    </>
  )
}

export default PageConfig;
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import NavBar from "./components/NavBar/NavBar";
import { Outlet, useLocation } from "react-router-dom";

const BodyDiv = styled.div`
  width: 100vw;
  position: fixed;
  height: calc(100% - calc(${props => props.theme.navHeight} + ${props => props.theme.borderSize}*2));
  bottom: calc(${props => props.theme.navHeight} + ${props => props.theme.borderSize}*2);
  overflow-y: scroll;
`;

const SideMargin = styled.div`
  --margin-sides: clamp(1.35rem, 6vw, 10rem);
  margin: 0 var(--margin-sides);
`;

const PageConfig = () => {

  const BodyDivRef = useRef<null | HTMLDivElement>(null);
  
  const location = useLocation();
  
  useEffect(() => {
    if (BodyDivRef.current !== null) {
      BodyDivRef.current.scrollTop = 0;
    }
  }, [location])

  return (
    <>
      <BodyDiv ref={BodyDivRef}>
        <SideMargin>
          <Outlet />
        </SideMargin>
      </BodyDiv>
      <NavBar />
    </>
  )
}

export default PageConfig;
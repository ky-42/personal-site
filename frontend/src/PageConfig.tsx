import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import NavBar from "./components/NavBar/NavBar";
import { Outlet, useLocation } from "react-router-dom";

// Where all content will be displayed does not include nav bar
const BodyDiv = styled.div`
  width: 100vw;
  position: fixed;
  height: calc(100% - calc(${props => props.theme.navHeight} + ${props => props.theme.borderSize}*2));
  bottom: calc(${props => props.theme.navHeight} + ${props => props.theme.borderSize}*2);
  overflow-y: scroll;
`;

// Idk why this couldnt go in the BodyDiv but it couldnt
const SideMargin = styled.div`
  margin: 0 clamp(2.16rem, 6vw, 16.0rem) 3.0rem;
`;

const PageConfig = () => {
  
  /*
  Set up the page for the content of the pages to be put in.
  the screen in separated in to two divs the navbar on the bottom
  and a div to show to pages content. These two divs dont overlap.
  */
  
  const location = useLocation();
  
  /*
  Scoll to top of the main content div when user goes to new page.
  Needed because the div contining the main content does not
  rerender just the inside elements meaning the scoll of the div
  does not reset.
  */
  const BodyDivRef = useRef<null | HTMLDivElement>(null);
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
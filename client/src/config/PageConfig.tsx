import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import NavBar from '../components/NavBar/NavBar';
import { NavigationType, Outlet, useLocation, useNavigationType } from 'react-router-dom';

// Where all content will be displayed does not include nav bar
const BodyDiv = styled.div`
  width: 100vw;
  position: fixed;
  height: calc(
    100% - calc(${(props) => props.theme.navHeight} + ${(props) => props.theme.borderSize}*2)
  );
  bottom: calc(${(props) => props.theme.navHeight} + ${(props) => props.theme.borderSize}*2);
  overflow-y: scroll;
`;

// Idk why this couldn't go in the BodyDiv but it couldn't
const SideMargin = styled.div`
  margin: 0 clamp(2.16rem, 6vw, 16rem) 3rem;
`;

const PageConfig = () => {
  /*
  Set up the page for the content of the pages to be put in.
  the screen in separated in to two divs the navbar on the bottom
  and a div to show to pages content. These two divs don't overlap.
  */

  const location = useLocation();

  // Need for scroll event listener
  const locationRef = useRef(location);
  locationRef.current = location;

  const navigationType = useNavigationType();

  /*
  Scroll to top of the main content div when user goes to new page.
  Needed because the div containing the main content does not
  rerender just the inside elements meaning the scroll of the div
  does not reset.
  */
  const BodyDivRef = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    // Sets scroll position when page changes
    // If the user navigates backwards then the scroll position is set to the last scroll position
    const pathName = location.pathname.replace(/\/$/, '');
    if (BodyDivRef.current !== null) {
      BodyDivRef.current.scrollTop =
        sessionStorage.getItem(`scrollPosition_${pathName}`) !== null &&
        navigationType === NavigationType.Pop
          ? parseInt(sessionStorage.getItem(`scrollPosition_${pathName}`) as string)
          : 0;
    }
  }, [location]);

  // Save the scroll position of the current page
  BodyDivRef.current?.addEventListener('scroll', () => {
    if (BodyDivRef.current !== null) {
      sessionStorage.setItem(
        `scrollPosition_${locationRef.current.pathname.replace(/\/$/, '')}`,
        BodyDivRef.current.scrollTop.toString(),
      );
    }
  });

  return (
    <>
      <BodyDiv ref={BodyDivRef}>
        <SideMargin>
          <Outlet />
        </SideMargin>
      </BodyDiv>
      <NavBar />
    </>
  );
};

export default PageConfig;

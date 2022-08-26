import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useWindowSize } from 'react-use';

const NavBarDiv = styled.nav`
  width: 100%;
  position: fixed;
  bottom: 0%;
`;

const NavBarLink = styled(Link)`

`;

const HomeLink = styled(NavBarLink)`

`;

const DesktopNavBar = () => {
  return (
    <NavBarDiv>
      <NavBarLink to="/projects">
        Projects
      </NavBarLink>
      <NavBarLink to="/blogs">
        Blogs
      </NavBarLink>
      <HomeLink to="/">
        Kyle
        Denief
      </HomeLink>
      <NavBarLink to="/about-me">
        About Me
      </NavBarLink>
      <NavBarLink to="contact">
        Contact
      </NavBarLink>
    </NavBarDiv>
  );
};

export default DesktopNavBar;

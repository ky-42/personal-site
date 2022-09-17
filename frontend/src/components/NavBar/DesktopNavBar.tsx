import React from 'react';
import styled from 'styled-components';
import LinkNavBar from './LinkDesktopNavBar';
import { useWindowSize } from 'react-use';

const NavBarDiv = styled.nav`
  width: calc(100% - 10px);
  position: fixed;
  bottom: 0%;
  height: 55px;
  display: flex;
  gap: 5px;
  background-color: white;
  padding: 5px;
`;

const HomeLink = styled(LinkNavBar)`
  flex: 0.7 1 0;
`;

const DesktopNavBar = () => {
  return (
    <NavBarDiv>
      <LinkNavBar to="/projects" title='Projects' />
      <LinkNavBar to="/blogs" title='Blogs' />
      <HomeLink to="/" title='Kyle Denief' />
      <LinkNavBar to="/about" title='About Me' />
      <LinkNavBar to="/Connect" title='Connect' />
    </NavBarDiv>
  );
};

export default DesktopNavBar;

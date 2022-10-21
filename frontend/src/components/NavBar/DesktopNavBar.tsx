import React from 'react';
import styled from 'styled-components';
import LinkNavBar from './LinkDesktopNavBar';

const NavBarDiv = styled.nav`
  width: calc(100vw - ${props => props.theme.borderSize}*2);
  position: fixed;
  bottom: 0%;
  height: ${props => props.theme.navHeight};
  display: flex;
  border: ${props => props.theme.borderSize} solid ${props => props.theme.darkTone};
  column-gap: ${props => props.theme.borderSize};
  background-color: ${props => props.theme.darkTone};
`;

const DesktopNavBar = () => {
  return (
    <NavBarDiv>
      <LinkNavBar to="/about" title='About Me' />
      <LinkNavBar to="/connect" title='Connect' />
      <LinkNavBar to="/" title='Kyle Denief' />
      <LinkNavBar to="/projects" title='Projects' />
      <LinkNavBar to="/blogs" title='Blogs' />
    </NavBarDiv>
  );
};

export default DesktopNavBar;

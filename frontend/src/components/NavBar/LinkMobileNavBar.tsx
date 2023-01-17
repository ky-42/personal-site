import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

interface LinkNavBarProps {
  className?: string,
  to: string,
  title: string,
}

const LinkDiv = styled.div<{active: number}>`
  flex: 1 1 0;
  display: table;
  text-align: center;
  width: 100vw;
  background-color: ${props => props.theme.backgroundColour};
  outline: ${props => props.theme.borderSize} solid ${props => props.theme.darkTone};
  z-index: ${props => props.active ? 5 : 0};
`;

const NavLink = styled(Link)<{active: number}>`
  display: table-cell;
  vertical-align: middle;
  color: ${props => props.active ? props.theme.highlight : props.theme.textColour};
  text-decoration: ${props => props.active ? `underline ${props.theme.highlight}` : "none"};
  font-size: 2.0rem;
`;

const LinkNavBar = ({className, to, title}:LinkNavBarProps) => {

  const location = useLocation().pathname;
  const active = location === to;

  return (
    <LinkDiv className={className} active={+active}>
      <NavLink to={to} active={+active}>
        {title}
      </NavLink>
    </LinkDiv>  
  )
}

export default LinkNavBar;
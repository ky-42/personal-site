import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

interface LinkNavBarProps {
  className?: string,
  to: string,
  title: string,
}

const LinkDiv = styled.div`
  flex: 1 1 0;
  display: table;
  text-align: center;
  background-color: black;
  width: 100vw;
`;

const NavLink = styled(Link)`
  display: table-cell;
  vertical-align: middle;
`;

const LinkNavBar = ({className, to, title}:LinkNavBarProps) => {
  return (
    <LinkDiv className={className}>
      <NavLink to={to}>
        {title}
      </NavLink>
    </LinkDiv>  
  )
}

export default LinkNavBar;
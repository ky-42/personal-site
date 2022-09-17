import React from "react";
import styled from 'styled-components';
import { Link, To } from 'react-router-dom';

interface HomeLinkProps {
  LinkAddress: string,
  LinkName: string,
  LinkExtra?: React.ReactNode
}

const LinkContainer = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  border: 10px solid ${props => props.theme.textColour};
  background-color: ${props => props.theme.backgroundColour};
  text-decoration: none;
`;

const LinkTitle = styled.h2`
  margin: 0;
  text-align: center;
  color: ${props => props.theme.textColour};
`;

const LinkExtraContent = styled.div`
  
`;

const HomeLink = ({ LinkAddress, LinkName, LinkExtra }: HomeLinkProps) => {
  return (
    <LinkContainer to={LinkAddress} >
      <LinkTitle>
        {LinkName}
      </LinkTitle>
      {LinkExtra}
    </LinkContainer>
  )
}

export default HomeLink;
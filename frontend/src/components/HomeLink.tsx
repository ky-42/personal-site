import React from "react";
import styled from 'styled-components';
import { Link, To } from 'react-router-dom';
import { JsxElement } from "typescript";

interface HomeLinkProps {
  LinkAddress: String,
  LinkName: String,
  LinkExtra?: React.ReactNode
}

const LinkContainer = styled(Link)`
  
`;

const LinkTitle = styled.h2`
  
`;

const LinkExtraContent = styled.div`
  
`;

const HomeLink = ({ LinkAddress, LinkName, LinkExtra }: HomeLinkProps) => {
  return (
    <LinkContainer to={ LinkAddress as To } >
      <LinkTitle>
        {LinkName}
      </LinkTitle>
      {LinkExtra}
    </LinkContainer>
  )
}

export default HomeLink;
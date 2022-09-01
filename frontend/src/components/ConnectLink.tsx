import React from "react";
import styled from "styled-components";

interface ConnectLinkProps {
  LinkTo: string,
  Icon: React.ReactNode
}

const a = styled.a`
  
`;

const ConnectLinkDiv = styled.div`

`;

const ConnectLink = ({ LinkTo, Icon }: ConnectLinkProps) => {
  
  return (
    <a href={LinkTo}>
      <ConnectLinkDiv>
        {Icon}
      </ConnectLinkDiv>
    </a>
  )
}

export default ConnectLink;
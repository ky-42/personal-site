import React from "react";
import styled from "styled-components";

interface ConnectLinkProps {
  LinkTo: string;
  Icon: React.ReactNode;
}

const SocialLink = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  margin: 25px;
  border: 5px solid ${props => props.theme.lightTone};
  &:hover {
    border: 5px solid ${props => props.theme.highlight};
  }
`;

const ConnectLinkDiv = styled.div`
  color: ${props => props.theme.textColour};
  font-size: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ExternalLink = ({ LinkTo, Icon }: ConnectLinkProps) => {
  return (
    <SocialLink href={LinkTo}>
      <ConnectLinkDiv>{Icon}</ConnectLinkDiv>
    </SocialLink>
  );
};

export default ExternalLink;

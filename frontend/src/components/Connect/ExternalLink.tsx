import React from "react";
import styled from "styled-components";

/* -------------------------------------------------------------------------- */

const SocialLink = styled.a`
  //Idk why felx is needed here but it centers
  display: flex;
  width: 10.0rem;
  height: 10.0rem;
  border: 0.5rem solid ${props => props.theme.lightTone};
  &:hover {
    border-color: ${props => props.theme.highlight};
  }
`;

const ConnectLinkDiv = styled.div`
  // Removes link colouring
  color: ${props => props.theme.textColour};
  font-size: 4.8rem;
  // Centers icon
  display: flex;
  align-items: center;
  margin: auto;
`;

/* -------------------------------------------------------------------------- */

interface ConnectLinkProps {
  LinkTo: string;
  Icon: React.ReactNode;
}

const ExternalLink = ({ LinkTo, Icon }: ConnectLinkProps) => {
  return (
    <SocialLink href={LinkTo}>
      <ConnectLinkDiv>{Icon}</ConnectLinkDiv>
    </SocialLink>
  );
};

export default ExternalLink;

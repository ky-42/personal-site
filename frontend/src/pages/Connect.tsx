import React, { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { AiFillGithub, AiFillTwitterCircle, AiFillLinkedin } from "react-icons/ai";

import PageTitle from "../components/PageTitle";
import ExternalLink from "../components/Connect/ExternalLink";
import MetaData from "../components/MetaData";

/* -------------------------------------------------------------------------- */

const ConnectBody = styled.main`
  margin: auto;
  max-width: 1000px;
`;

const BodyText = styled.p``;

const Email = styled.h2`
  text-align: center;
  margin: clamp(50px, 8vw, 75px) 0px;
  font-size: clamp(1.1rem, 6vw, 2.1rem);
  font-variation-settings: 'wght' 650;
  cursor: pointer;
`;

// Div that contains external links
const ExternalLinks = styled.section`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
`;

/* ------------------------- Email copy notification ------------------------ */

const copyNotificationKeyframes = keyframes`  
  0% { opacity: 1; }
  60% { opacity: 1; }
  100% { opacity: 0; }
`; 

const copyNotificationActive = css`
  animation: ${copyNotificationKeyframes} 3s linear 1;
  cursor: auto;
`

const CopyNotifictionBubble = styled.div<{active: boolean}>`
  // Positioning
  position: fixed;
  bottom: calc(${props => props.theme.navHeight} + 20px);
  left: 50%;
  transform: translateX(-50%);
  text-align: center;

  background-color: ${props => props.theme.backgroundColour};
  border: ${props => props.theme.lightTone} solid ${props => props.theme.borderSize};
  border-radius: 2px;
  padding: 5px;
  opacity: 0;
  cursor: default;
  
  // Adds animation and other css when notification is active
  ${props => props.active ? copyNotificationActive : ""}
`

/* -------------------------------------------------------------------------- */

const Connect = () => {
  
  // State for whether copy notification is visable
  const [copyNotification, setCopyNotification] = useState(false);
  
  return (
    <ConnectBody>
      <MetaData
        title="Connect With Me | Kyle Denief"
        description="Hi I'm Kyle Denief if you want to chat the best way to contact me is email!"
        type="website"
      />
    
      <PageTitle>
        Connect With Me        
      </PageTitle>
      <BodyText>
        Hi! Thanks for your interest in contacting me. Please feel free to contact me for any reason at anytime even if you just want to have a conversation. You can conact me on Linkedin, Twitter, or Github but I might now recive your message right away on those platforms so your best bet is to email me at,
      </BodyText>

      <Email onClick={() => {
        // Copies email and sets state
        navigator.clipboard.writeText("ky42@protonmail.com");
        setCopyNotification(true);
        // Sets timer to change state when animation is finished
        if (!copyNotification) {
          setTimeout(() => setCopyNotification(false), 3000);
        }
      }}>
        Ky42@protonmail.com
      </Email>

      <ExternalLinks>
        <ExternalLink LinkTo="https://github.com/PinkLittlePig" Icon={<AiFillGithub />} />
        <ExternalLink LinkTo="https://twitter.com/ky421_" Icon={<AiFillTwitterCircle />} />
        <ExternalLink LinkTo="https://www.linkedin.com/in/kyle-denief-132059230/" Icon={<AiFillLinkedin />} />
      </ExternalLinks>

      {/* Copy notification element */}
      <CopyNotifictionBubble active={copyNotification}>
        Email Copied
      </CopyNotifictionBubble>
    </ConnectBody>
  )
}

export default Connect;
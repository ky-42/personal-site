import { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import {
  AiFillGithub,
  AiFillTwitterCircle,
  AiFillLinkedin,
  AiFillInstagram,
  AiFillYoutube,
  AiFillGitlab,
  AiFillCodepenCircle,
} from 'react-icons/ai';
import PageTitle from '../components/Shared/PageTitle';
import ExternalLink from '../components/Connect/ExternalLink';
import MetaData from '../components/Shared/MetaData';
import jsonConfig from '@config/config.json';

/* -------------------------------------------------------------------------- */

const ConnectBody = styled.main`
  margin: auto;
  max-width: 100rem;
`;

const BodyText = styled.p`
  margin-bottom: 0;
`;

const Email = styled.h2`
  text-align: center;
  margin: clamp(5rem, 8vw, 7.5rem) 0rem;
  font-size: clamp(1.76rem, 6vw, 3.36rem);
  font-variation-settings: 'wght' 650;
  cursor: pointer;
`;

// Div that contains external links
const ExternalLinks = styled.section`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  row-gap: 5rem;
  column-gap: 5rem;
`;

/* -------------------------- Icons from link types ------------------------- */

const iconMatch = {
  github: <AiFillGithub />,
  twitter: <AiFillTwitterCircle />,
  linkedin: <AiFillLinkedin />,
  instagram: <AiFillInstagram />,
  youtube: <AiFillYoutube />,
  gitlab: <AiFillGitlab />,
  codepen: <AiFillCodepenCircle />,
};

/* ------------------------- Email copy notification ------------------------ */

const copyNotificationKeyframes = keyframes`  
  0% { opacity: 1; }
  60% { opacity: 1; }
  100% { opacity: 0; }
`;

const copyNotificationActive = css`
  animation: ${copyNotificationKeyframes} 3s linear 1;
  cursor: auto;
`;

const CopyNotificationBubble = styled.div<{ active: boolean }>`
  // Positioning
  position: fixed;
  bottom: calc(${(props) => props.theme.navHeight} + 2rem);
  left: 50%;
  transform: translateX(-50%);
  text-align: center;

  background-color: ${(props) => props.theme.backgroundColour};
  border: ${(props) => props.theme.lightTone} solid ${(props) => props.theme.borderSize};
  border-radius: 0.2rem;
  padding: 0.5rem;
  opacity: 0;
  cursor: default;

  // Adds animation and other css when notification is active
  ${(props) => (props.active ? copyNotificationActive : '')}
`;

/* -------------------------------------------------------------------------- */

const Connect = () => {
  // State for whether copy notification is visible
  const [copyNotification, setCopyNotification] = useState(false);

  return (
    <ConnectBody>
      <MetaData
        title={`Connect With Me | ${jsonConfig.name}`}
        description={jsonConfig.pages.connect.description}
        type='website'
      />

      <PageTitle>Connect With Me</PageTitle>
      <BodyText>{jsonConfig.pages.connect.mainParagraph}</BodyText>

      <Email
        onClick={() => {
          // Copies email and sets state
          navigator.clipboard.writeText(jsonConfig.pages.connect.email);
          setCopyNotification(true);
          // Sets timer to change state when animation is finished
          if (!copyNotification) {
            setTimeout(() => setCopyNotification(false), 3000);
          }
        }}
      >
        Ky42@protonmail.com
      </Email>

      <ExternalLinks>
        {
          // Adds any number of links defined in config.json
          jsonConfig.pages.connect.links.map((linkData) => {
            return (
              <ExternalLink
                LinkTo={linkData.url}
                Icon={iconMatch[linkData.name as keyof typeof iconMatch]}
                key={linkData.name}
              />
            );
          })
        }
      </ExternalLinks>

      {/* Copy notification element */}
      <CopyNotificationBubble active={copyNotification}>Email Copied</CopyNotificationBubble>
    </ConnectBody>
  );
};

export default Connect;

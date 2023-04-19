import styled, { css, keyframes } from "styled-components";
import { NotificationInfo, NotificationType } from "../../contexts/Notification";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";

/* ------------------ Animation for fading out notification ----------------- */

const fadeOutKeyframes = keyframes`
  0% {opacity: 100%}
  75% {opacity: 100%}
  100% {opacity: 0%}
`;

const fadeOutAnimation = css`
  animation: ${fadeOutKeyframes} 5s linear 1;
`;

/* -------------------------------------------------------------------------- */

const NotificationContainer = styled.div<{noteType: NotificationType, hovered: boolean}>`
  pointer-events: all;
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: 80%;
  margin: 0.7rem 0;
  padding: 0.3rem;
  background-color: ${props => props.theme.backgroundColour};
  border: 0.2rem solid ${props => {
    // Set border colour based on notification type
    switch (props.noteType) {
      case NotificationType.Error:
        return props.theme.errorColour;
      case NotificationType.Warning:
        return props.theme.highlightDark;
      case NotificationType.Info:
        return props.theme.lightTone;
      case NotificationType.Success:
        return props.theme.highlight;
    }
  }};
  ${props => props.hovered ? "" : fadeOutAnimation};
`;

const Message = styled.p`
  margin: 0;
  padding: 0.25rem;
  padding-right: 0;
  font-size: 1.5rem;
  color: ${props => props.theme.textColour};
`;

const CloseButton = styled(IoMdClose)`
  font-size: 2rem;
  flex-shrink: 0;
  margin: 0 clamp(0.25rem, 2.5vw, 1rem);
`;

/* -------------------------------------------------------------------------- */

interface NotificationBoxProps {
  id: number;
  notification: NotificationInfo;
  deleteNotification: (id: number) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

const NotificationBox = ({id, notification, deleteNotification, onMouseEnter, onMouseLeave}: NotificationBoxProps) => {
  
  const [hovered, setHovered] = useState(false);
  
  return (
    <NotificationContainer
      noteType={notification.type}
      hovered={hovered}
      // Handles hover events for both mouse and touch
      // Will stop fading and keep notification on screen
      onMouseEnter={() => {setHovered(true); onMouseEnter();}}
      onMouseLeave={() => {setHovered(false); onMouseLeave();}}
      onTouchStart={() => {setHovered(true); onMouseEnter();}}
      onTouchEnd={() => {setHovered(false); onMouseLeave();}}
    >
      <Message>{notification.message}</Message>
      <CloseButton
        onClick={() => deleteNotification(id)}
      />
    </NotificationContainer>  
  )
};

export default NotificationBox;

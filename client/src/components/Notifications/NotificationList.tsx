import { useContext } from "react";
import styled from "styled-components";
import { NotificationContext } from "../../contexts/Notification";
import NotificationBox from "./NotificationBox";

/* -------------------------------------------------------------------------- */

const NotificationListDiv = styled.div`
  pointer-events: none;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
`;

/* -------------------------------------------------------------------------- */

const NotificationList = () => {
  
  const {
    notifications,
    deleteNotification,
    startTimer,
    stopTimer
  } = useContext(NotificationContext);
  
  return (
    <NotificationListDiv>
      {
        // Map over notifications and create a NotificationBox for each one
        Object.keys(notifications).map((notificationId) => {
          return <NotificationBox
            key={parseInt(notificationId)}
            id={parseInt(notificationId)}
            notification={notifications[parseInt(notificationId)]}
            deleteNotification={deleteNotification}
            onMouseEnter={() => stopTimer(parseInt(notificationId))}
            onMouseLeave={() => startTimer(parseInt(notificationId))}
          />
        })
      }
    </NotificationListDiv>
  );
};

export default NotificationList;
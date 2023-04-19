import { ReactNode, createContext, useRef, useState } from "react";

/* -------------------------------------------------------------------------- */

export enum NotificationType {
  Error = "error", 
  Success = "success",
  Info = "info",
  Warning = "warning"
};

export interface NotificationInfo {
  message: string;
  type: NotificationType;
};

export const NotificationContext = createContext({
  notifications: {} as Record<number, NotificationInfo>,
  startTimer: (notificationId: number) => {},
  stopTimer: (notificationId: number) => {},
  addNotification: (notification: NotificationInfo) => {},
  deleteNotification: (notificationId: number) => {},
});

/* -------------------------------------------------------------------------- */
  
export const NotificationProvider = ({ children }: {children: ReactNode}) => {
  
  const [notifications, setNotifications] = useState<Record<number, NotificationInfo>>({});
  const [notificationTimers, setNotificationTimers] = useState<Record<number, number>>({});
  
  // Used to create unique notification ids starts high and lowers as notifications
  // are iterated through so that the most recent notification is always highest
  const [notificationCount, setNotificationCount] = useState(1000000);
  
  // Creates references to the current state of notifications and timers so that they can be accessed in timeouts
  const notificationsRef = useRef(notifications);
  notificationsRef.current = notifications;
  
  const notificationTimersRef = useRef(notificationTimers);
  notificationTimersRef.current = notificationTimers;
  
  // Starts a timer to remove a notification
  const startTimer = (notificationId: number) => {
    const newNotificationTimers = {...notificationTimers};
    newNotificationTimers[notificationId] = setTimeout(() => {
      deleteNotification(notificationId);
      // IMPORTANT When updating Timer, also update the animation time in NotificationBox.tsx
    }, 5000);
    setNotificationTimers(newNotificationTimers);
  }

  // Stops a timer to remove a notification
  const stopTimer = (notificationId: number) => {
    clearTimeout(notificationTimersRef.current[notificationId]);

    const newNotificationTimers = {...notificationTimersRef.current};
    delete newNotificationTimers[notificationId];
    setNotificationTimers(newNotificationTimers);
  };
  
  // Removes a notification 
  const deleteNotification = (notificationId: number) => {
    const newNotifications = {...notificationsRef.current};
    delete newNotifications[notificationId];
    setNotifications(newNotifications);

    stopTimer(notificationId);
  };

  // Adds a notification 
  const addNotification = (notification: NotificationInfo) => {
    setNotifications({...notifications, [notificationCount]: notification});
    startTimer(notificationCount);
    setNotificationCount(notificationCount - 1);
  };
  
  return (
    <NotificationContext.Provider value={{ notifications, startTimer, stopTimer, deleteNotification, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
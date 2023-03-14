import React, { useState } from "react";

export interface Notification {
  message: string;
}


const NotificationContext = React.createContext({
  addError: (notification: Notification) => {
  },
  removeError: (notification: Notification) => {
  },
  getErrorNotifications: () => {
    const result: Notification[] = [];
    return result;
  }
});

export const NotificationProvider: React.FC = (props) => {
  const [errorNotifications, setErrorNotifications] = useState<Notification[]>([]);
  const addError = (notification: Notification) => {
    setErrorNotifications(oldNotificationArray => {
      return [...oldNotificationArray, notification];
    });
  };

  const removeError = (notificationToRemove: Notification) => {
    const notificationsAfterRemoval = errorNotifications.filter(notification => notification.message !== notificationToRemove.message);
    setErrorNotifications(notificationsAfterRemoval);
  };

  const getErrorNotifications = () => {
    return errorNotifications;
  };

  const contextValue = { addError, removeError, getErrorNotifications };

  return (
    <NotificationContext.Provider value={contextValue}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
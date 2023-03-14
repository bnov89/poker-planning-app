import React, { useContext } from "react";
import NotificationContext from "../store/notification-context";
import { Alert } from "@mui/material";

interface NotificationsProps {

}

const Notifications: React.FC<NotificationsProps> = (props) => {
  const { getErrorNotifications, removeError } = useContext(NotificationContext);
  // console.log(getErrorNotifications)
  return (<React.Fragment>
      {
        getErrorNotifications() ? getErrorNotifications().map((errorNotification, index) =>
        <Alert key={index} onClose={event => removeError(errorNotification)}>{errorNotification.message}</Alert>
      ) : <div>Jestem</div>
      }
    </React.Fragment>
  );
};
export default Notifications;
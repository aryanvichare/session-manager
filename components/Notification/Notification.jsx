import React from "react";
import styles from "./Notification.module.scss";

const Notification = ({ type, name, message }) => {
  switch (type) {
    case "connect":
      return (
        <div className={styles.connectMessage}>{name} joined the party</div>
      );

    case "disconnect":
      return (
        <div className={styles.disconnectMessage}>{name} left the party!</div>
      );

    case "message":
      return (
        <div className={styles.userMessage}>
          {name} says "{message}"
        </div>
      );

    case "bot":
      return (
        <div className={styles.botMessage}>
          {name} says "{message}"
        </div>
      );

    default:
      return null;
  }
};

export default Notification;

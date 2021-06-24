import React, { useState, useEffect } from "react";
import Router, { useRouter } from "next/router";
import io from "socket.io-client";

import styles from "@/styles/Session.module.scss";
import Participant from "@/components/Participant/Participant";
import Notification from "@/components/Notification/Notification";
import axios from "axios";

const LOCALSTORAGE_NAME_KEY = "session-name-autofill";
const ENDPOINT = "http://localhost:5000";

const socketRef = io.connect(ENDPOINT, {
  secure: true,
  reconnection: true,
  rejectUnauthorized: false,
});

const Session = () => {
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [participants, setParticipants] = useState([]);

  const router = useRouter();
  const sessionId =
    router.query["sessionId"] ||
    router.asPath.match(new RegExp(`[&?]${"sessionId"}=(.*)(&|$)`));

  async function fetchCurrentUsers() {
    const response = await axios.post(
      `${ENDPOINT}/clients`,
      { sessionId: sessionId },
      { headers: { "Content-Type": "application/json" } }
    );

    const { clients } = response.data;
    setParticipants(clients);
  }

  useEffect(() => {
    if (!sessionId) return null;
    const name = localStorage.getItem(LOCALSTORAGE_NAME_KEY);

    setParticipants([...participants, { name, sessionId, id: socketRef.id }]);

    if (!name) {
      Router.push(`/join/${sessionId}`);
    }

    // fetch current users
    socketRef.emit("join_room", { sessionId, name });
    fetchCurrentUsers();

    return () => socketRef.disconnect();
  }, [sessionId]);

  useEffect(() => {
    socketRef.on("new_user", ({ users, name }) => {
      if (users) {
        setParticipants(users);
        let newNotifications = notifications.concat({
          type: "connect",
          name,
        });
        setNotifications(newNotifications);
      }
    });

    socketRef.on("user_disconnect", ({ name, connectedUsers }) => {
      setParticipants(connectedUsers);
      let newNotifications = notifications.concat({
        type: "disconnect",
        name,
      });
      setNotifications(newNotifications);
    });

    socketRef.on("user_message", ({ message, name }) => {
      let newNotifications = notifications.concat({
        type: "message",
        message,
        name,
      });

      setNotifications(newNotifications);
    });
  }, [notifications]);

  const sendMessage = (e) => {
    e.preventDefault();
    const name = localStorage.getItem(LOCALSTORAGE_NAME_KEY);

    socketRef.emit("new_message", { message, sessionId, name });
    let newNotifications = notifications.concat({
      type: "message",
      message,
      sessionId,
      name,
    });
    setNotifications(newNotifications);

    setMessage("");
  };

  return (
    <div className={styles.screenLayout}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.flex}>
              <h1 className={styles.header}>Participants</h1>
              <p>{participants.length} active</p>
            </div>
            <div className={styles.participantsList}>
              {participants.map(({ name }, idx) => (
                <Participant key={idx} name={name} />
              ))}
            </div>
          </div>
          <div className={styles.chatContainer}>
            <div className={styles.chatWindow}>
              {notifications.map((props, idx) => (
                <Notification key={idx} {...props} />
              ))}
            </div>
            <form onSubmit={sendMessage} className={styles.chatForm}>
              <input
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                type='text'
                className={styles.chatbox}
                placeholder='Send a message'
              />
              <button
                onClick={sendMessage}
                type='submit'
                className={styles.chatSubmit}>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Session;

import React from "react";
import styles from "./Participant.module.scss";

const Participant = ({ name }) => {
  return (
    <div className={styles.participantContainer}>
      <div className={styles.participantCircle}>
        {name?.substring(0, 1).toUpperCase()}
      </div>
      <div className={styles.participantName}>{name}</div>
    </div>
  );
};

export default Participant;

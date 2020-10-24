import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./SessionCard.module.scss";

const SessionCard = (props) => {
  return (
    <div className={styles.sessionCardContainer}>
      <div className={styles.sessionInfo}>
        <div className={styles.sessionID}>Session ID: {props.sessionID}</div>
        <div className={styles.sessionOwner}>Owner: {props.owner}</div>
      </div>
      <NavLink to={`/${props.sessionID}`}>Enter</NavLink>
      <button onClick={props.deleteSession.bind(this, props.sessionID)}>
        Delete
      </button>
    </div>
  );
};
export default SessionCard;

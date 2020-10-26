import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./SessionCard.module.scss";
import { motion } from "framer-motion";

const SessionCard = (props) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 200 }}
      animate={{ opacity: [0, 1, 1], x: [200, -50, 0] }}
      transition={{ duration: 0.4, x: { stiffness: 10, velocity: -100 } }}
      className={styles.sessionCardContainer}
    >
      <div className={styles.sessionInfo}>
        <div className={styles.sessionID}>Session ID: {props.sessionID}</div>
        <div className={styles.sessionOwner}>Owner: {props.owner}</div>
      </div>
      <NavLink to={`/${props.sessionID}`}>Enter</NavLink>
      <button onClick={props.deleteSession.bind(this, props.sessionID)}>
        Delete
      </button>
    </motion.div>
  );
};
export default SessionCard;

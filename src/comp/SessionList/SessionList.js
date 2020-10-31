import React, { useState, useContext } from "react";
import SessionCard from "./SessionCard";
import { AuthContext } from "../../context/AuthContext";
import styles from "./SessionList.module.scss";
import SignOut from "../SignOut";
import { motion } from "framer-motion";

const SessionList = (props) => {
  const [sessionIDAdd, setSessionIDAdd] = useState("");
  const auth = useContext(AuthContext);

  const sessionIDInputChange = (e) => {
    setSessionIDAdd(e.target.value);
  };

  const joinSessionHandler = async () => {
    const result = await props.addToSession(sessionIDAdd);
    if (!result) alert("The Session ID don't exist, please check!");
  };

  return (
    <div>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: [-100, 10, 0] }}
        transition={{ duration: 0.4, y: { stiffness: 1000, velocity: -100 } }}
        className={styles.sessionsTitle}
      >
        <img src={auth.currentUser.photoURL} alt="userImg" />
        <h1>
          {auth.currentUser.displayName
            ? auth.currentUser.displayName
            : "Untitled User"}
          {"'s "}
          Sessions
        </h1>
        <SignOut />
      </motion.div>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: [-100, 10, 0] }}
        transition={{ duration: 0.4, y: { stiffness: 1000, velocity: -100 } }}
        className={styles.joinOptions}
      >
        <input
          placeholder="Session ID"
          value={sessionIDAdd}
          onChange={sessionIDInputChange}
        />
        <button onClick={joinSessionHandler}>Join Session</button>
        <button onClick={props.startNewSession}>create new session</button>
      </motion.div>
      <div className={styles.sessionCardContainer}>
        {props.sessions ? (
          props.sessions.map((s) => (
            <SessionCard
              key={s.id}
              sessionID={s.id}
              owner={s.email}
              deleteSession={props.deleteSession}
            />
          ))
        ) : (
          <p
            style={{
              margin: "2rem auto",
              color: "#ffeac7",
              textAlign: "center",
              fontSize: "1.2rem",
            }}
          >
            No session yet, please create or join one.
          </p>
        )}
      </div>
    </div>
  );
};
export default SessionList;

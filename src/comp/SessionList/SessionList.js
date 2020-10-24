import React, { useState } from "react";
import SessionCard from "./SessionCard";
import styles from "./SessionList.module.scss";
import SignOut from "../SignOut";

const SessionList = (props) => {
  const [sessionIDAdd, setSessionIDAdd] = useState("");

  const sessionIDInputChange = (e) => {
    setSessionIDAdd(e.target.value);
  };

  const joinSessionHandler = async () => {
    const result = await props.addToSession(sessionIDAdd);
    if (!result) alert("The Session ID don't exist, please check!");
  };

  return (
    <div>
      <div className={styles.sessionsTitle}>
        <h1>Your Sessions</h1>
        <SignOut />
      </div>
      <div className={styles.sessionCardContainer}>
        {props.sessions &&
          props.sessions.map((s) => (
            <SessionCard
              key={s.id}
              sessionID={s.id}
              owner={s.email}
              deleteSession={props.deleteSession}
            />
          ))}
      </div>
      <div className={styles.joinOptions}>
        <input
          placeholder="Session ID"
          value={sessionIDAdd}
          onChange={sessionIDInputChange}
        />
        <button onClick={joinSessionHandler}>Join Session</button>
        <button onClick={props.startNewSession}>create new session</button>
      </div>
    </div>
  );
};
export default SessionList;

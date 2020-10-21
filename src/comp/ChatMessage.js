import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "./ChatMessage.module.scss";

function ChatMessage(props) {
  const auth = useContext(AuthContext);
  const { text, uid, photoURL } = props.msg;
  const messageClass =
    uid === auth.currentUser.uid ? styles.sentMsg : styles.recievedMsg;

  return (
    <div className={messageClass}>
      <img className={styles.msgImg} alt="" src={photoURL} />
      <p className={styles.msg}>{text}</p>
    </div>
  );
}

export default ChatMessage;

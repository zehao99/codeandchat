import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "./ChatMessage.module.scss";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

function ChatMessage(props) {
  const auth = useContext(AuthContext);
  const { text, uid, photoURL } = props.msg;
  const [showNameTag, setShowNameTag] = useState(false);
  const messageClass =
    uid === auth.currentUser.uid ? styles.sentMsg : styles.recievedMsg;
  const msgTextClass =
    uid === auth.currentUser.uid ? styles.sentMsgText : styles.recievedMsgText;

  const openNameTag = () => {
    setShowNameTag(true);
  };
  const closeNameTag = () => {
    setShowNameTag(false);
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.4 }}
      className={messageClass}
    >
      <div
        className={styles.msgImg}
        onMouseEnter={openNameTag}
        onMouseLeave={closeNameTag}
      >
        <img alt="" src={photoURL} />
        {showNameTag ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={
              uid === auth.currentUser.uid
                ? styles.rightNameTag
                : styles.leftNameTag
            }
          >
            {props.email}
          </motion.p>
        ) : null}
      </div>
      <div className={styles.msgContent}>
        <p className={styles.userDisplayName}>{props.displayName}</p>
        <p className={msgTextClass}>{text}</p>
      </div>
      {uid === auth.currentUser.uid && (
        <FontAwesomeIcon
          className={styles.deleteIcon}
          icon={faTrashAlt}
          onClick={props.handleDelete.bind(this, props.id)}
        />
      )}
    </motion.div>
  );
}

export default ChatMessage;

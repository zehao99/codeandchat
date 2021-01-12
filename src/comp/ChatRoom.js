import React, { useState, useRef, useContext, lazy, Suspense } from "react";
import { AuthContext, FirestoreContext } from "../context/AuthContext";
import ChatMessage from "./ChatMessage";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import styles from "./ChatRoom.module.scss";
import { useParams, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
const CodeEditor = lazy(() => import("./CodeEditor"));

function ChatRoom(props) {
  const { sessionID } = useParams();

  const auth = useContext(AuthContext);
  const firestore = useContext(FirestoreContext);

  const messageRef = firestore.collection("messages");
  const query = messageRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");

  const dummy = useRef();
  const sendMessage = async () => {
    const { uid, photoURL } = auth.currentUser;
    if (formValue === "" || !formValue) return;
    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      email: auth.currentUser.email,
      displayName: auth.currentUser.displayName,
      uid,
      photoURL,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await sendMessage();
  };

  const handleEnterSend = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage("1");
    }
  };

  const handleDelete = async (id) => {
    await messageRef.doc(id).delete();
  };

  const ctx = (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.4 }}
      className={styles.chatPageContainer}
    >
      <div className={styles.codeEditor}>
        <Suspense
          fallback={
            <div className={styles.editorLoadingText}>
              <p>Loading Code Editor...</p>
              <p>This might take 10 to 30s</p>
            </div>
          }
        >
          <CodeEditor docID={sessionID} />
        </Suspense>
      </div>
      <div className={styles.chatContainer}>
        <div className={styles.userOptions}>
          <img src={auth.currentUser.photoURL} alt="user-img" />
          <p>
            {auth.currentUser.displayName
              ? auth.currentUser.displayName
              : "Untitled User"}
          </p>
          <NavLink to="/">
            <FontAwesomeIcon icon={faChevronLeft} /> Back
          </NavLink>
        </div>
        <div className={styles.chatMsgShow}>
          {messages &&
            messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                msg={msg}
                id={msg.id}
                email={msg.email}
                displayName={msg.displayName}
                handleDelete={handleDelete}
              />
            ))}

          <div ref={dummy}></div>
        </div>
        <form onSubmit={handleSubmit} className={styles.chatInput}>
          <textarea
            placeholder="Say Something"
            value={formValue}
            onKeyPress={handleEnterSend}
            onChange={(e) => setFormValue(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </motion.div>
  );

  return ctx;
}

export default ChatRoom;

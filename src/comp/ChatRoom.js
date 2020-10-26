import React, { useState, useRef, useContext } from "react";
import { AuthContext, FirestoreContext } from "../context/AuthContext";
import ChatMessage from "./ChatMessage";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import styles from "./ChatRoom.module.scss";
import useWindowDimensions from "../utilities/useWindowDimensions";
import CodeEditor from "./CodeEditor";
import { useParams, NavLink } from "react-router-dom";
import useJudgeTouch from "../utilities/useJudgeTouch";
import Dummy from "./DummyComp";

function ChatRoom(props) {
  const { sessionID } = useParams();

  const auth = useContext(AuthContext);
  const firestore = useContext(FirestoreContext);

  const messageRef = firestore.collection("messages");
  const query = messageRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");

  const dummy = useRef();
  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;
    if (formValue === "" || !formValue) return;
    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  const ctx = (
    <div className={styles.chatPageContainer}>
      <div className={styles.codeEditor}>
        <CodeEditor docID={sessionID} />
      </div>
      <div className={styles.chatContainer}>
        <div className={styles.userOptions}>
          <NavLink to="/"> Back </NavLink>
        </div>
        <div className={styles.chatMsgShow}>
          {messages &&
            messages.map((msg) => <ChatMessage key={msg.id} msg={msg} />)}

          <div ref={dummy}></div>
        </div>
        <form onSubmit={sendMessage} className={styles.chatInput}>
          <textarea
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );

  return ctx;
}

export default ChatRoom;

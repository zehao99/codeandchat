import React, { useState, useRef, useContext, useEffect} from "react";
import { AuthContext, FirestoreContext } from "../context/AuthContext";
import ChatMessage from "./ChatMessage";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import SignOut from "./SignOut";
import styles from "./ChatRoom.module.scss";
import AceEditor from "react-ace";
import useWindowDimensions from "../utilities/useWindowDimensions";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/snippets/java";
import "ace-builds/src-noconflict/theme-monokai";
import diff_match_patch from "diff-match-patch";
function ChatRoom(props) {
  const { width, height } = useWindowDimensions();
  const auth = useContext(AuthContext);
  const firestore = useContext(FirestoreContext);

  const messageRef = firestore.collection("messages");
  const query = messageRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");
  
  const codeRefe = useRef();

  const codeRef = firestore.collection("codes");
  const codeQuery = codeRef.orderBy("createdAt","desc").limit(1);
  const [code] = useCollectionData(codeQuery, { idField: "id" });
  const [codeInput, setCodeinput] = useState("");
  const [patchedCode, setPatchedCode] = useState("");
  const [lastUpdate, setLastUpdate] = useState(" ");
  const dmp = new diff_match_patch();

  useEffect(() => {
    if(!code || !code[0]) return;
    const recievedCode = code[0].code;
    if(recievedCode === patchedCode) return;
    if(recievedCode !== codeInput){

      let patch_list = dmp.patch_make(lastUpdate, recievedCode);
      let results = dmp.patch_apply(patch_list, codeInput);
      setPatchedCode(results[0]);
      setCodeinput(results[0]);
    }else{
      setPatchedCode(recievedCode);
    }
    setLastUpdate(recievedCode);
    const timer2 = setTimeout(100);
    return () => {
      clearTimeout(timer2);
    }
  }, [code]);


  useEffect(() => {
    if(!codeRefe.current.props.value || codeInput === patchedCode) return;
    const timer = setTimeout(async ()=>{
      const {uid} = auth.currentUser;
      if(codeInput === codeRefe.current.props.value){
        await codeRef.add({
          code: codeInput,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          uid,
        })
      }
    },500)
    return () => {
      clearTimeout(timer);
    }
  }, [codeInput])


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

  const onEditorChange = (val) => {
    setCodeinput(val);
  };

  const ctx =
    width < height ? (
      <div>Please use this app in horizontal mode</div>
    ) : (
      <div className={styles.chatPageContainer}>
        <div className={styles.codeEditor}>
          <AceEditor
            ref={codeRefe}
            mode="java"
            theme="monokai"
            value={codeInput}
            onChange={onEditorChange}
            name="codeEditor"
            editorProps={{ $blockScrolling: true }}
            width="100%"
            height="100vh"
          />
        </div>
        <div className={styles.chatContainer}>
          <div className={styles.userOptions}>
            <SignOut />
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

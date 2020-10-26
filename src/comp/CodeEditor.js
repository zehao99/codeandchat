import React, { useState, useRef, useContext, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { AuthContext, FirestoreContext } from "../context/AuthContext";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/snippets/java";
import "ace-builds/src-noconflict/theme-monokai";
import diff_match_patch from "diff-match-patch";

/**
 * Code editor component with database update function
 *
 * @param {*} props Input props
 */
const CodeEditor = (props) => {
  const auth = useContext(AuthContext);
  const firestore = useContext(FirestoreContext);

  const codeRefObj = useRef();
  const docID = props.docID;
  const codeRef = firestore.collection("sessions");
  const codeQuery = codeRef.doc(docID);
  const [code] = useDocumentData(codeQuery, { idField: "id" });
  const [codeInput, setCodeinput] = useState("");
  const [patchedCode, setPatchedCode] = useState("");
  const [lastUpdate, setLastUpdate] = useState(" ");
  const dmp = new diff_match_patch();

  useEffect(() => {
    if (!code || !code.code) return;
    const recievedCode = code.code;
    if (recievedCode === patchedCode) return;
    if (recievedCode !== codeInput) {
      let patch_list = dmp.patch_make(lastUpdate, recievedCode);
      let results = dmp.patch_apply(patch_list, codeInput);
      setPatchedCode(results[0]);
      setCodeinput(results[0]);
    } else {
      setPatchedCode(recievedCode);
    }
    setLastUpdate(recievedCode);
    const timer2 = setTimeout(100);
    return () => {
      clearTimeout(timer2);
    };
  }, [code]);

  useEffect(() => {
    if (!codeRefObj.current.props.value || codeInput === patchedCode) return;
    const timer = setTimeout(async () => {
      if (codeInput === codeRefObj.current.props.value) {
        await codeQuery.set({
          code: codeInput,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          isPublic: code.isPublic,
          owner: code.owner,
        });
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [codeInput]);

  const onEditorChange = (val) => {
    setCodeinput(val);
  };

  return (
    <AceEditor
      ref={codeRefObj}
      mode="java"
      theme="monokai"
      value={codeInput}
      onChange={onEditorChange}
      name="codeEditor"
      editorProps={{ $blockScrolling: true }}
      width="100%"
      height="100vh"
    />
  );
};

export default CodeEditor;

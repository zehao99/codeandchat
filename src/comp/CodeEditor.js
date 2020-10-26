import React, { useState, useRef, useContext, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { FirestoreContext } from "../context/AuthContext";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-jsx";
import styles from "./CodeEditor.module.scss";
import diff_match_patch from "diff-match-patch";
import LangSelector from "./LanguageSelector/LangSelector";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";

const langShow = [
  "Java",
  "C++",
  "Python",
  "TypeScript",
  "Ruby",
  "Sass",
  "Markdown",
  "MySQL",
  "golang",
  "C#",
];

const langValues = [
  "java",
  "c_cpp",
  "python",
  "typescript",
  "ruby",
  "sass",
  "markdown",
  "mysql",
  "golang",
  "csharp",
];
langValues.forEach((lang) => {
  require(`ace-builds/src-noconflict/mode-${lang}`);
  require(`ace-builds/src-noconflict/snippets/${lang}`);
});

const themes = [
  "monokai",
  "github",
  "tomorrow",
  "kuroir",
  "twilight",
  "xcode",
  "textmate",
  "solarized_dark",
  "solarized_light",
  "terminal",
];

themes.forEach((theme) => require(`ace-builds/src-noconflict/theme-${theme}`));

/**
 * Code editor component with database update function
 *
 * @param {*} props Input props
 */
const CodeEditor = (props) => {
  const firestore = useContext(FirestoreContext);

  const codeRefObj = useRef();
  const docID = props.docID;
  const codeRef = firestore.collection("sessions");
  const codeQuery = codeRef.doc(docID);
  const [code] = useDocumentData(codeQuery, { idField: "id" });
  const [codeInput, setCodeinput] = useState("");
  const [patchedCode, setPatchedCode] = useState("");
  const [lastUpdate, setLastUpdate] = useState(" ");
  const [language, setLanguage] = useState(langValues[0]);
  const [theme, setTheme] = useState(themes[0]);
  const [autoComplete, setAutoComplete] = useState(false);
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

  useEffect(() => {}, [language]);

  const onEditorChange = (val) => {
    setCodeinput(val);
  };

  const handleLangChange = (idx) => {
    setLanguage(langValues[idx]);
  };

  const handleThemeChange = (idx) => {
    setTheme(themes[idx]);
  };

  const handletoggleAC = () => {
    setAutoComplete((prev) => !prev);
  };

  return (
    <div>
      <div className={styles.languageSelector}>
        <p>Language: </p>
        <LangSelector values={langShow} onChange={handleLangChange} />
        <p>Theme: </p>
        <LangSelector values={themes} onChange={handleThemeChange} />
        <p
          className={styles.autocompleteButton}
          style={
            autoComplete
              ? { color: "rgb(167, 255, 211)" }
              : { color: "rgb(255, 167, 167)" }
          }
          onClick={handletoggleAC}
        >
          AutoComplete
        </p>
      </div>
      <AceEditor
        ref={codeRefObj}
        mode={language}
        theme={theme}
        value={codeInput}
        onChange={onEditorChange}
        name="codeEditor"
        editorProps={{ $blockScrolling: true }}
        width="100%"
        height="92vh"
        setOptions={{
          enableLiveAutocompletion: autoComplete,
          tabSize: 2,
        }}
      />
    </div>
  );
};

export default CodeEditor;

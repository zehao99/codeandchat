import React, { useState } from "react";
import styles from "./App.module.scss";

import { useAuthState } from "react-firebase-hooks/auth";

import { AuthContext, FirestoreContext } from "./context/AuthContext";

import SignIn from "./comp/SignIn";
import UserInterface from "./comp/UserInterface";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import firebaseConfig from "./appInfo";
import useJudgeTouch from "./utilities/useJudgeTouch";
import useWindowDimensions from "./utilities/useWindowDimensions";
import Dummy from "./comp/DummyComp";

firebase.initializeApp(firebaseConfig);

const authenticate = firebase.auth();
const firestoreDB = firebase.firestore();

function App() {
  const { width, height } = useWindowDimensions();
  const { isTouch } = useJudgeTouch();
  const [auth] = useState(authenticate);
  const [firestore] = useState(firestoreDB);
  const [user] = useAuthState(auth);
  return isTouch || width < 600 || height < 600 ? (
    <div className={styles.App}>
      <Dummy />
    </div>
  ) : (
    <AuthContext.Provider value={auth}>
      <FirestoreContext.Provider value={firestore}>
        <div className={styles.App}>
          <section>{user ? <UserInterface /> : <SignIn />}</section>
        </div>
      </FirestoreContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;

import React, { useState } from "react";
import styles from "./App.module.scss";

import { useAuthState } from "react-firebase-hooks/auth";

import { AuthContext, FirestoreContext } from "./context/AuthContext";

import SignIn from "./comp/SignIn";
import ChatRoom from "./comp/ChatRoom";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import firebaseConfig from "./appInfo";

firebase.initializeApp(firebaseConfig);

const authenticate = firebase.auth();
const firestoreDB = firebase.firestore();

function App() {
  const [auth] = useState(authenticate);
  const [firestore] = useState(firestoreDB);
  const [user] = useAuthState(auth);
  return (
    <AuthContext.Provider value={auth}>
      <FirestoreContext.Provider value={firestore}>
        <div className={styles.App}>
          <section>{user ? <ChatRoom /> : <SignIn />}</section>
        </div>
      </FirestoreContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;

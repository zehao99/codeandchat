import React, { useState } from "react";
import styles from "./App.module.scss";

import { useAuthState } from "react-firebase-hooks/auth";

import { AuthContext, FirestoreContext } from "./context/AuthContext";

import SignIn from "./comp/SignIn";
import ChatRoom from "./comp/ChatRoom";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyDp6z0_0Ty_Fj0eb9g6ZSCT_GA8qgDIzTo",
  authDomain: "reactchat-7d5e7.firebaseapp.com",
  databaseURL: "https://reactchat-7d5e7.firebaseio.com",
  projectId: "reactchat-7d5e7",
  storageBucket: "reactchat-7d5e7.appspot.com",
  messagingSenderId: "563729060578",
  appId: "1:563729060578:web:d5cf6c95123f7a4e6d04bb",
  measurementId: "G-WPXCXV7N74",
};

firebase.initializeApp(firebaseConfig);

const authenticate = firebase.auth();
const firestoreDB = firebase.firestore();

function App() {
  const [auth, setAuth] = useState(authenticate);
  const [firestore, setFirestore] = useState(firestoreDB);
  const [user] = useAuthState(auth);
  return (
    <AuthContext.Provider value={auth}>
      <FirestoreContext.Provider value={firestore}>
        <div className={styles.App}>
          <header></header>
          <section>{user ? <ChatRoom /> : <SignIn />}</section>
        </div>
      </FirestoreContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;

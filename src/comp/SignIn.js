import React, { useContext } from "react";
import firebase from "firebase/app";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import styles from "./SignIn.module.scss";

export default function SignIn() {
  const auth = useContext(AuthContext);
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <div className={styles.signInPage}>
      <h1>Welcome to the chat</h1>
      <button onClick={signInWithGoogle}>
        <FontAwesomeIcon icon={faGoogle} style={{ paddingRight: "0.5rem" }} />
        Sign in with Google
      </button>
    </div>
  );
}

import React, { useContext } from "react";
import firebase from "firebase/app";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import styles from "./SignIn.module.scss";

export default function SignIn() {
  const auth = useContext(AuthContext);
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  const ctx = (
    <div className={styles.signInPage}>
      <h1>Welcome to Code and Chat, have fun.</h1>
      <p>
        In this application, you can collaborate with your friends on a code
        playground and chat with everyone in the room.
      </p>
      <button onClick={signInWithGoogle}>
        <FontAwesomeIcon icon={faGoogle} style={{ paddingRight: "0.5rem" }} />
        Sign in with Google
      </button>
      <a href="https://github.com/zehao99/easychat">
        <FontAwesomeIcon icon={faGithub} /> Github
      </a>
    </div>
  );

  return ctx;
}

import React, { useEffect, useContext, useState } from "react";
import { AuthContext, FirestoreContext } from "../context/AuthContext";
import firebase from "firebase/app";
import ChatRoom from "./ChatRoom";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import SessionList from "./SessionList/SessionList";

/**
 * Deal with user action.
 * @param {} props
 */
function UserInterface(props) {
  const auth = useContext(AuthContext);
  const firestore = useContext(FirestoreContext);
  const uid = auth.currentUser.uid;
  const email = auth.currentUser.email;
  const userRef = firestore.collection("users");
  const userQuery = userRef.doc(uid);
  const sessionRef = firestore.collection("sessions");

  const [userInfo, setUserInfo] = useState();
  const newUserInfo = {
    userID: auth.currentUser.uid,
    email: auth.currentUser.email,
    photoURL: auth.currentUser.photoURL,
    sessions: [],
    lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
  };

  const newSessionInfo = {
    owner: {
      uid,
      email,
    },
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    code: "",
    isPublic: false,
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      const user = await userQuery.get();
      const userData = user.data();
      if (!userData) {
        await userQuery.set(newUserInfo);
        setUserInfo(newUserInfo);
      } else {
        userData.lastLogin = firebase.firestore.FieldValue.serverTimestamp();
        await userQuery.set(userData);
        setUserInfo(userData);
      }
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const startNewSession = async () => {
    const { id } = await sessionRef.add(newSessionInfo);
    const docRef = { ...newSessionInfo };
    docRef.id = id;
    addSessionToUser(docRef);
  };

  const addToSession = async (id) => {
    const sessionGet = await sessionRef.doc(id).get();
    const docRef = sessionGet.data();
    if (!docRef) return false;
    docRef.id = id;
    addSessionToUser(docRef);
    return true;
  };

  const addSessionToUser = (docRef) => {
    const temp = { ...userInfo };
    let contain = false;
    temp.sessions.filter((e) => {
      if (e.id && e.id !== docRef.id) return true;
      else {
        contain = true;
        return false;
      }
    });
    if (contain) return;
    temp.sessions.push({ id: docRef.id, email: docRef.owner.email });
    setUserInfo(temp);
    userQuery.set(userInfo);
  };

  const deleteSessionFromUser = (id) => {
    const temp = { ...userInfo };
    temp.sessions = temp.sessions.filter((e) => {
      return e.id !== id;
    });
    setUserInfo(temp);
    userQuery.set(userInfo);
  };

  return (
    <Router>
      <Switch>
        <Route path="/:sessionID" children={<ChatRoom />} />
        <Route
          path="/"
          children={
            <SessionList
              sessions={userInfo ? userInfo.sessions : null}
              startNewSession={startNewSession}
              addToSession={addToSession}
              deleteSession={deleteSessionFromUser}
            />
          }
        />
      </Switch>
    </Router>
  );
}

export default UserInterface;

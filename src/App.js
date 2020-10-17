import React,{useState, useRef} from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

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
  measurementId: "G-WPXCXV7N74"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick = {signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (

    <button onClick={()=> auth.signOut()}>Sign Out</button>
  );
}

function ChatRoom() {
  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');

  const dummy = useRef();
  const sendMessage = async(e) =>{
    e.preventDefault();
    
    const {uid, photoURL} = auth.currentUser;
    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    })
    
    setFormValue('');
    dummy.current.scrollIntoView({behavior: 'smooth'});
  }

  return (
    <div>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} msg={msg}/>)}

        <div ref={dummy}></div>
      </div>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e)=>setFormValue(e.target.value)}/>
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

function ChatMessage(props) {
  const {text, uid, photoURL} = props.msg;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message${messageClass}`}>
      <img src={photoURL}/>
      <p>{text}</p>
    </div>
  )
}


export default App;

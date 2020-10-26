import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Sign out button component
 */
export default function SignOut() {
  const auth = useContext(AuthContext);
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
}

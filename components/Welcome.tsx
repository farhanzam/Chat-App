import React from "react";
import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import GoogleSignin from "../assets/btn_google_signin_dark_pressed_web.png";
// import ReactIcon from "../assets/React-icon.png";

const Welcome = () => {
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  return (
    <main className="welcome">
      <h2>Welcome to the Chat App</h2>
      {/* <img src="/logo512.png" alt="ReactJs logo" width={50} height={50} /> */}
      {/* src={ReactIcon.src} */}
      <p>Start chatting with with other users!</p>
      <button className="sign-in">
        <img
          onClick={googleSignIn}
          src={GoogleSignin.src}
          alt="sign in with google"
          type="button"
        />
      </button>
    </main>
  );
};

export default Welcome;

'use client'
import { auth } from "../components/firebase";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Welcome from "../components/Welcome";
import MatchingRoom from '../components/matchingRoom';
import '@/assets/globals.css';

export default function App() {
  const [signedInUser] = useAuthState(auth);
  return (
    <div className="App">
      {!signedInUser ? (
        <Welcome />
      ) : (
        <MatchingRoom signedInUser={signedInUser} />
      )}
    </div>
  );
}

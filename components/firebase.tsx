// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKm96Gm5iHQayYaFq4XsSF3eM6FI7SigU",
  authDomain: "chat-app-411fc.firebaseapp.com",
  projectId: "chat-app-411fc",
  storageBucket: "chat-app-411fc.appspot.com",
  messagingSenderId: "808555607866",
  appId: "1:808555607866:web:a218de9809a4eaced7c203",
  measurementId: "G-N9M7E1DHQY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);

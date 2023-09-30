'use client'
import { db } from "@/components/firebase";
import React, { useEffect, useState } from "react";
import {
  query,
  limit,
  addDoc,
  onSnapshot,
  collection,
} from "firebase/firestore";
import { User } from 'firebase/auth';
import { useRouter } from 'next/navigation'
import MyUser from '@/components/myUser';

const waitingRoomPath = ["waitingRoom"];

type MatchingRoomProps = {
  signedInUser: User;
};

export default function MatchingRoom({ signedInUser }: MatchingRoomProps) {
  const router = useRouter();
  const [otherUsers, setOtherUsers] = useState(null);
  useEffect(() => {
    if (otherUsers) {
      addUserToWaitingRoom(signedInUser, otherUsers);
    }
  }, [otherUsers]);
  useEffect(() => {
    subscribeToWaitingRoom(otherUsers, setOtherUsers);
  }, []);
  const matchHandler = (user2: MyUser) => {
    router.push(`/chatRoom/?id=${user2.uid}`);
  }

  // below are the html elements that list the users waiting to talk 
  // when the user clicks on any other user, take the user to the chatroom
  return(
    <div>
      <h1 style={{margin: "20px", textAlign: "center"}}>Currently open users:</h1>
      {
      otherUsers ? (otherUsers as []).map((user2: MyUser) => {
        if (signedInUser.uid == user2.uid) {
          return
        }
        return (
          <div className="matching-room-container" onClick={() => matchHandler(user2)} key={user2.uid}>
            <img src={user2.avatar} style={{width: "60px", height: "60px", marginRight: "10px", borderRadius: "50%"}}/> 
            <h3 style={{color: "#ffffff"}}>{user2.name}</h3>
          </div>
        )
      }) : <>Loading</>
      }
    </div>
  );
}

function addUserToWaitingRoom(user: User, existingUsers: Array<User>) {
  // console.log(existingUsers.map(u => u.uid))
  // console.log(user.uid)
  // console.log(existingUsers.map(u => u.uid).includes(user.uid))
  if (existingUsers.map(u => u.uid).includes(user.uid)) {
    return;
  }
  addDoc(collection(db, waitingRoomPath.join('/')), {
    name: user.displayName,
    avatar: user.photoURL,
    uid: user.uid
  });
}

function subscribeToWaitingRoom(otherUsers: any, setOtherUsers: React.Dispatch<React.SetStateAction<any>>) {
  const q = query(
    collection(db, waitingRoomPath.join('/')),
    // orderBy("createdAt", "desc"),
    limit(50)
  );
  const runForEveryDBUpdate = (QuerySnapshot: any) => {
    const fetchedOtherUsers: any[] = [];
    // fetch messages
    QuerySnapshot.forEach((doc: any) => {
      fetchedOtherUsers.push({ ...doc.data(), id: doc.id });
    });
    // change following section to sort by users who've been waiting the longest
    // const sortedMessages = fetchedMessages.sort(
    //   (a, b) => a.createdAt - b.createdAt
    // );
    if (!arrayEquals(otherUsers, fetchedOtherUsers)) {
      setOtherUsers(fetchedOtherUsers);
    }
  }
  onSnapshot(q, runForEveryDBUpdate);
}

function arrayEquals(a: Array<any>, b: Array<any>) {
  return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
}
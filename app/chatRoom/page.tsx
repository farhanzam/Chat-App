'use client'
import React, { useEffect, useRef, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
  where,
  getDocs
} from "firebase/firestore";
import { db } from "@/components/firebase";
import Message from "@/components/message";
import TextBox from "./textBox";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/components/firebase";
import { useSearchParams } from 'next/navigation'
import '@/assets/globals.css';


export default function ChatRoom() {
    const [user1] = useAuthState(auth);
    const searchParams = useSearchParams();
    const user2Uid = searchParams.get('id');
    const [user2, setUser2] = useState(null);
    useEffect(() => { getUserWithUid(user2Uid, setUser2) }, []);

    const [messages, setMessages] = useState([]);
    const scroll = useRef();

    useEffect(() => {
        if (!user2) return;
        const q = query(
            collection(db, ...(getMessagesPath(user1, user2) as [])),
            orderBy("createdAt", "desc"),
            limit(50)
        );

        // fires every time there's a database update
        const runEveryTimeTheresADBUpdate = (QuerySnapshot) => {
        const fetchedMessages = [];
        // fetch messages between the two users
        QuerySnapshot.forEach((doc) => {
            fetchedMessages.push({ ...doc.data(), id: doc.id });
        });
        // sort messages by their creation time (latest messages at the end of the list)
        const sortedMessages = fetchedMessages.sort(
            (a, b) => a.createdAt - b.createdAt
        );
        // add all messages to the messages array so they can be displayed to the user
        setMessages(sortedMessages);
        }
        const unsubscribe = onSnapshot(q, runEveryTimeTheresADBUpdate);

        // return () => unsubscribe;
    }, [user2]);

    return (
        <>
        {
            !user2 ? 
                <>Loading</> 
                :
                <main className="chat-box">
                    {/* <div style={{backgroundColor:'#3A3A40'}}> */}
                    <div className="chat-room-header">
                        <img
                            className="chat-bubble_profile_pic"
                            src={user2.avatar}
                            alt="user avatar"
                            style={{borderRadius:50, height: 75, marginLeft: 15, marginRight: 15, marginTop: 5, marginBottom: 5}}
                            />
                        <p>{user2.name}</p>
                    </div>
                    <div className="messages-wrapper">
                        {messages?.map((message) => (
                        <Message key={message.id} user={user1} message={message} />
                        ))}
                    </div>
                    {/* When a new message enters the chat, the screen scrolls down to the scroll div*/}
                    <span ref={scroll}></span>
                    <TextBox scroll={scroll} docPath={getMessagesPath(user1, user2)} />
                </main>
        }
        </>
    );
};


async function getUserWithUid(uid: string | null, setUser2: any) {
    const waitingRoomPath = ["waitingRoom"];
    const q = query(
        collection(db, ...waitingRoomPath),
        where("uid", "==", uid)
    );
    const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        setUser2(doc.data());
    });
}
function getMessagesPath(user1, user2) {
    const uidArray = [user1, user2].map(u => u.uid)
    uidArray.sort()
    return ["messages", uidArray.join('-'), "messages"]
}
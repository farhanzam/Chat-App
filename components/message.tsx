import React from "react";
import { User } from 'firebase/auth';

type MessageProps = {
    user: User;
    message: any;
};

export default function Message({ user, message }: MessageProps){
  const isRightSide = message.uid === user.uid;
  return (
    <div style={{position:"relative", display:"block"}}>
      <div style={{position: "absolute", display: "block", right: 5, left: 3, bottom: -6, zIndex: 0}}>
        <div className={isRightSide ? 'rightArrow' : 'leftArrow'} />
        <div className={isRightSide ? 'rightArrowOverlap' : 'leftArrowOverlap'} />
      </div>
      <div className={`chat-bubble ${message.uid === user.uid ? "right" : ""}`}>
        {/* <img
          className="chat-bubble_profile_pic"
          src={message.avatar}
          alt="user avatar"
        />
        <div>
          <p className="user-name">{message.name}</p>
          <p className="user-message">{message.text}</p>
        </div> */}
        <p style={{fontSize: 16, justifyContent:"center"}}>{message.text}</p>
        
      </div>
    </div>
  );
};

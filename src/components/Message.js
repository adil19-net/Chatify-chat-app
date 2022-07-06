import React, { useRef, useEffect } from "react";
import Moment from 'react-moment'


const Message = ({msg,user11}) => {
    const scrollRef = useRef();

    useEffect(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [msg]);
  return (
    <div className={`message_wrapper ${msg.from==user11 ? 'own':''}`}>
        <p className={msg.from==user11?'me':'friend'}>
            {msg.media ? <img src={msg.media} alt={msg.text} /> :null}
            {msg.text!='' ? msg.text:null}
            <br/>
            <small>
                <Moment fromNow>{msg.createdAt.toDate()}</Moment>
            </small>
        </p>

    </div>
  )
}

export default Message
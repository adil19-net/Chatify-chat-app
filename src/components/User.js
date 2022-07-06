import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import Img from '../image1.jpg'

const User = ({user11,user,selectUser,chat}) => {
  const user22=user?.uid
  const [data,setData]=useState('');
  const id= (user11>user22)?`${user11 + user22}`: `${user22 + user11}`

  useEffect(()=>{
    const unsub=onSnapshot(doc(db,'lastMsg',id),(doc)=>{
      setData(doc.data())
    })
    return ()=>unsub()
  },[])

  return (
    <>
    <div className={`user_wrapper ${user.name===chat.name && 'selected_user'}`} onClick={()=>selectUser(user)}>
        <div className="user_info">
            <div className="user_detail">
                <img src={user.avatar || Img} alt='avatar' className='avatar' />
                <h4>{user.name}</h4>
                {data?.from !== user11 && data?.unread && (
              <small className="unread">New</small>
            )}
            </div>
            <div
            className={`user_status ${user.isOnline ? 'online':'offline'}`}>

            </div>
        </div>
        {data && (
          <p className="truncate"><strong>{data.from===user11 ? 'Me: ':null}</strong>{data.text}</p>
        )}
    </div>
    <div
    onClick={() => selectUser(user)}
    className={`sm_container ${chat.name === user.name && "selected_user"}`}>
    <img
      src={user.avatar || Img}
      alt="avatar"
      className="avatar sm_screen"
    />
    </div>
    </>
  )
}

export default User
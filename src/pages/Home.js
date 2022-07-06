import React,{useContext, useEffect, useState} from 'react'
import { AuthContext } from '../context/auth'
import {useNavigate} from 'react-router-dom'
import {auth, db, storage} from '../firebase'
import {collection,where,onSnapshot,query, addDoc, Timestamp, orderBy, setDoc, doc, getDoc, updateDoc} from 'firebase/firestore'
import User from '../components/User'
import MessageForm from '../components/MessageForm'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Message from '../components/Message'

function Home() {
    const {user}=useContext(AuthContext)
    const navigate=useNavigate();
    useEffect(()=>{
        if(!user){
            navigate('/login');
        }
        // console.log(user);
    },[user])
    const [users1,setUsers1]=useState([]);
    const [chat,setChat]=useState('');
    const [text,setText]=useState('');
    const [img,setImg]=useState('')
    const [msgs,setMsgs]=useState([])

    const user11=auth.currentUser?.uid
    // user11 is current user id
    // chat is user on whom we click to send message(same as user 22)
    // users1 is all users except me to display on left and chat on right
    // text is message sent just now

    useEffect(()=>{
        const usersRef=collection(db,'users');
        const q=query(usersRef,where('uid','not-in',[auth.currentUser && auth.currentUser.uid]));
        const unsub=onSnapshot(q,(querySnapshot)=>{
            let users2=[]
            querySnapshot.forEach((doc)=>{
                users2.push(doc.data());
            })
            setUsers1(users2)
        })
        return ()=>unsub()
    },[])
    // console.log(users1)
    
    const selectUser=async(user)=>{
        // console.log(user);
        setChat(user);
        const user22=user?.uid
        const id= (user11>user22)?`${user11 + user22}`: `${user22 + user11}`
        const msgsRef=collection(db,'messages',id,'chat');
        const q=query(msgsRef,orderBy('createdAt','asc'));
        onSnapshot(q,(querySnapshot)=>{
            let msgs=[]
            querySnapshot.forEach(doc=>{
                msgs.push(doc.data());
            })
            setMsgs(msgs);
        })
        const docSnap=await getDoc(doc(db,'lastMsg',id))
        if(docSnap.data() && docSnap.data()?.from!=user11){
            await updateDoc(doc(db,'lastMsg',id),{
                unread:false
            })
        }

    }
    // console.log(msgs);

    const handleSubmit=async(e)=>{
        e.preventDefault()
        let url;
        
        const user22=chat.uid
        const id= (user11>user22)?`${user11 + user22}`: `${user22 + user11}`
        if(img){
            const imgRef=ref(storage,`images/${new Date().getTime()} - ${img.name}`)
            const snap=await uploadBytes(imgRef,img)
            const dlURL=await getDownloadURL(ref(storage,snap.ref.fullPath))
            url=dlURL
        }
        await addDoc(collection(db,'messages',id,'chat'),{
            text,
            from:user11,
            to:user22,
            createdAt: Timestamp.fromDate(new Date()),
            media: url || ""
        })
        await setDoc(doc(db,'lastMsg',id),{
            text,
            from:user11,
            to:user22,
            createdAt: Timestamp.fromDate(new Date()),
            media: url || "",
            unread:true
        })

        setText('')
        setImg('')
    }

  return (
    <div className="home_container">
        <div className="users_container">
            {users1.map((user111)=><User key={user111.id} user={user111} selectUser={selectUser} user11={user11} chat={chat}/>)}
        </div>
        <div className="messages_container">
            {chat? (<>
                <div className="messages_user">
                    <h3>{chat.name}</h3>
                </div>
                <div className="messages">
                    {msgs.length ? msgs.map((msg,i)=> <Message key={i} msg={msg} user11={user11}/>) : null}
                </div>
                <MessageForm text={text} handleSubmit={handleSubmit} setText={setText} setImg={setImg}/>
                </>
            ) :(
                <h3 className='no_conv'>Select a user to start conversation</h3>
            )
            }
        </div>
    </div>
  )
}

export default Home
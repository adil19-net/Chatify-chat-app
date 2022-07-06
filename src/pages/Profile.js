import React,{useContext, useEffect, useState} from 'react'
import { AuthContext } from '../context/auth'
import {useNavigate} from 'react-router-dom'
import Img from '../image1.jpg'
import Camera from '../components/svg/Camera'
import {auth, storage,db } from '../firebase'
import {ref,uploadBytes,getDownloadURL, deleteObject} from 'firebase/storage'
import {doc,getDoc,updateDoc} from 'firebase/firestore'
import Delete from '../components/svg/Delete'

const Profile = () => {
    const {user}=useContext(AuthContext)
    const navigate=useNavigate();
    useEffect(()=>{
        if(!user){
            navigate('/login');
        }
    },[user])

    const [user1,setUser1]=useState('');
    const [img,setImg]=useState('');
    useEffect(()=>{
        getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
            if (docSnap.exists) {
              setUser1(docSnap.data());
            }
          });


        // console.log(img);
        if(img){
            const uploadImg = async () => {
                const imgRef = ref(
                    storage,
                    `avatar/${new Date().getTime()} - ${img.name}`
                  );
                try {
                    if(user1.avatarPath){
                        await deleteObject(ref(storage,user1.avatarPath))
                    }

                      const snap=await uploadBytes(imgRef,img)
                      const url=await getDownloadURL(ref(storage,snap.ref.fullPath))

                      await updateDoc(doc(db, "users", auth.currentUser.uid), {
                        avatar: url,
                        avatarPath: snap.ref.fullPath,
                      });
                      setImg('');
                } catch (error) {
                //  console.log(error.message);   
                }
                
            }
            uploadImg()
        }
    },[img])

    const deleteImage=async()=>{
        try {
            const confirm=window.confirm('Delete Avatar?');
            if(confirm){
                await deleteObject(ref(storage,user1.avatarPath))
                await updateDoc(doc(db,'users',auth.currentUser.uid),{
                    avatar:'',
                    avatarPath:''
                })
                navigate('/')
            }
        } catch (error) {
            // console.log(error.message)
        }
    }

  return user1?(
    <section>
      <div className="profile_container">
        <div className="img_container">
          <img src={user1.avatar || Img} alt="avatar" />
          <div className="overlay">
            <div>
              <label htmlFor="photo">
                <Camera />
              </label>
              {user1.avatar ? <Delete deleteImage={deleteImage}/> : null}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="photo"
                onChange={(e) => setImg(e.target.files[0])}
              />
            </div>
          </div>
        </div>
        <div className="text_container">
          <h3>{user1.name}</h3>
          <p>{user1.email}</p>
          <hr />
          <small>Joined on : {user1.createdAt.toDate().toDateString()}</small>
        </div>
      </div>
    </section>
  ):(null)
}

export default Profile
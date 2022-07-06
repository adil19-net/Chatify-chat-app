import { signOut } from 'firebase/auth'
import { updateDoc,doc } from 'firebase/firestore'
import React,{useContext} from 'react'
import {Link} from 'react-router-dom'
import { auth, db } from '../firebase'
import {useNavigate} from 'react-router-dom'
import {AuthContext} from '../context/auth'

function Navbar() {
  const {user}=useContext(AuthContext)
  const navigate=useNavigate();
  const handleSignout=async()=>{
    await updateDoc(doc(db,'users',auth.currentUser.uid),
    {
      isOnline:false
    })
    signOut(auth);
    navigate('/login')
  }

  return (
    <nav>
        <h3>
            <Link to='/'>Chatify</Link>
        </h3>
        <div>
        { user ? 
          (<>
            <Link to='profile'>Profile</Link>
            <button className='btn' onClick={handleSignout}>Logout</button>
          </>):
          (
            <>
            <Link to='/register'>Register</Link>
            <Link to='/login'>Login</Link>
            </>
          )  
        }
         {/* {console.log(auth.currentUser)}    */}
        </div>
    </nav>
  )
}

export default Navbar
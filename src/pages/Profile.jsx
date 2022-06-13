import { useState, useEffect } from 'react'
import {getAuth} from 'firebase/auth'
import {useNavigate, Link} from 'react-router-dom'

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();

  const [formData, setFormData]= useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })

  const {name, email} = formData
  
  const onLogout = () => {
    //auth has a method called signout that is called when the user wants to sign out
    auth.signOut()

    navigate('/')
  }
  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">
          My Profile
        </p>
        <button type='button' className="logOut" onClick={onLogout}>
          Log Out
        </button>
      </header>
    </div>
  )
}

export default Profile
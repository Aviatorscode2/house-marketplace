import { useState, useEffect } from 'react'
import {getAuth, updateProfile} from 'firebase/auth'
import {doc, updateDoc} from 'firebase/firestore'
import {db} from '../firebase.config'
import {useNavigate, Link} from 'react-router-dom'
import { async } from '@firebase/util'
import {toast} from 'react-toastify'

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetails, setChangeDetails] = useState(false);
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

  const onSubmit = async (e) => {
    try {
      if(auth.currentUser.displayName !== name) {
        //Update Display Name in Firebase
        await updateProfile(auth.currentUser, {
          displayName: name,
        })

        //Update in Firestore
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name
        })
        
      }
      toast.success('Profile Updated');
    } catch (error) {
      toast.error('Could not update profile name')
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState, 
      [e.target.id]: e.target.value,
    }))
  }
  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={onLogout}>
          Log Out
        </button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Person Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? 'done' : 'change'}
          </p>
        </div>

        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? 'profileName' : 'profileNameActive'}
              disabled={!changeDetails}
              value= {name}
              onChange={onChange}
            />
            <input
              type="text"
              id="email"
              className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>
      </main>
    </div>
  );
}

export default Profile
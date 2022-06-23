import { useState, useEffect} from 'react'
import {getAuth, updateProfile} from 'firebase/auth'
import {doc, updateDoc, collection, getDocs, query, where, orderBy, deleteDoc} from 'firebase/firestore'
import {db} from '../firebase.config'
import {useNavigate, Link} from 'react-router-dom'
import {toast} from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import ListingItem from '../components/ListingItem'

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData]= useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)

  const {name, email} = formData
  
  const onLogout = () => {
    //auth has a method called signout that is called when the user wants to sign out
    auth.signOut()

    navigate('/')
  }

  useEffect(() => {
    const fetchUserLisitings = async () => {
      const listingsRef = collection(db, 'listings')

      const q = query(listingsRef, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'))

      const querySnap = await getDocs(q)

      let listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
        
      })
      setListings(listings);
      setLoading(false);
    }

    fetchUserLisitings()
  }, [auth.currentUser.uid])
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

  const onDelete = async (listingId) => {
    if(window.confirm('Are you sure you want to delete this listing?')) {
      await deleteDoc(doc(db, 'listings', listingId))
      const updatedListings = listings.filter((listing) => listing.id !== listingId)

      setListings(updatedListings)
      toast.success('Successfully deleted listing')
    }
  }

  const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)

  
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
        <Link to='/create-listing' className='createListing'>
          <img src={homeIcon} alt='home' />
          <p>Sell or Rent your home</p>
          <img src={arrowRight} alt='arrowRight' />
        </Link>

        {!loading && listings.length > 0 && (
          <>
            <p className="listingsText">Your Listings</p>
            <ul className='listingsList'>
              {listings.map((listing) => (
                <ListingItem key={listing.id} listing = {listing.data} id={listing.id} onDelete={() => onDelete(listing.id)} onEdit={() => onEdit(listing.id)}/>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

export default Profile
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import {doc, setDoc, serverTimestamp} from 'firebase/firestore'
import {db} from '../firebase.config'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import OAuth from '../components/OAuth';

function SignUp() {
  //state for if the user wants to show password or not
  const [showPassword, setShowPassword] = useState(false);

  //formData holding
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  //destructo=ing the formData
  const { name, email, password } = formData;
  //Initializing the useNavigate
  const navigate = useNavigate();

  // this onChange functions help keep track of values typed, for both email and password through their id's
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth()

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      const user = userCredential.user

      updateProfile(auth.currentUser, {
        displayName: name
      })

      // here we are creating a copy of the formData excluding the password and adding a timestamp
      const formDataCopy = {...formData}
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()

      // calling setDoc will update the firestore database and add our user to the users collection
      await setDoc(doc(db , 'users', user.uid), formDataCopy)

      navigate('/')
    } catch (error) {
      toast.error('Oops! Something went wrong')
    }
  }
  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>

        <form onSubmit={onSubmit}>
          <input
            type="text"
            className="nameInput"
            placeholder="Name"
            required
            id="name"
            value={name}
            onChange={onChange}
          />
          <input
            type="email"
            className="emailInput"
            placeholder="Email"
            required
            id="email"
            value={email}
            onChange={onChange}
          />

          <div className="passwordInputDiv">
            <input
              type={showPassword ? 'text' : 'password'}
              className="passwordInput"
              placeholder="Password"
              id="password"
              value={password}
              onChange={onChange}
            />
            <img
              src={visibilityIcon}
              alt="show password"
              className="showPassword"
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          </div>

          <div className="signUpBar">
            <p className="signUpText">Sign Up</p>
            <button className="signUpButton">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
        </form>

        <OAuth />

        <Link to="/sign-in" className="registerLink">
          Already have an Account? Sign In
        </Link>
      </div>
    </>
  );
}

export default SignUp;

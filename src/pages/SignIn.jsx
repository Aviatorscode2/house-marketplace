import { useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

function SignIn() {
  //state for if the user wants to show password or not
  const [showPassword, setShowPassword] = useState(false);

  //formData holding 
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
//destructo=ing the formData
  const {email, password} = formData;
//Initializing the useNavigate
  const navigate = useNavigate();

  // this onChange functions help keep track of values typed, for both email and password through their id's
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  } 

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();

    //signInWithEmailAndPassword returns a promise that
    const userCredential = await signInWithEmailAndPassword(auth, email, password)

    //if the user credential is same with the one we have on our databse then take the user to the explore page
    if(userCredential.user) {
      navigate('/');
    }
    } catch (error) {
      toast.error('Invalid user credentials')
      
    }
  }

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>
        
        <form onSubmit={onSubmit}>
          <input type="email" className="emailInput" placeholder="Email" required id="email" value={email} onChange={onChange} />

          <div className="passwordInputDiv">
            <input type={showPassword ? 'text' : 'password'} className="passwordInput" placeholder="Password"  id="password" value={password} onChange={onChange}/>
            <img src={visibilityIcon} alt="show password" className="showPassword" onClick={() => setShowPassword((prevState) => !prevState)} />
          </div>

          <Link to='/forgotpassword' className='forgotPasswordLink'>Forgot Password</Link>

          <div className="signInBar">
            <p className="signInText">
              Sign In
            </p>
            <button className="signInButton">
              <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>

        {/* Google OAuth */}
        <Link to='/sign-up' className='registerLink'>Don't have an Account? Sign Up </Link>
      </div>
    </>
  )
}

export default SignIn
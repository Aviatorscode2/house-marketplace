import { useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';
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

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>
        
        <form>
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
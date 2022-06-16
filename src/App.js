import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/PrivateRoute';
import Category from './pages/Category';
import Navbar from './components/Navbar'
import Explore from './pages/Explore'
import Offers from './pages/Offers'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import CreateListing from './pages/CreateListing';
import ForgotPassword from './pages/ForgotPassword'
import Listing from './pages/Listing'


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/offers" element={<Offers />} />
          {/* we have two categories avialable, rent or sell*/}
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/profile" element={<PrivateRoute />}>
            {/* this is what the Outlet in the PrivateRoute looks at */}
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route
            path="/category/:categoryName/category/:categoryName/:listingId"
            element={<Listing />}
          />
        </Routes>
        <Navbar />
      </Router>

      <ToastContainer />
    </>
  );
}

export default App;

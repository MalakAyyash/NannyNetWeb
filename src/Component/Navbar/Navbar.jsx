import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import Login from '../Login/Login';
import SignUp from '../SignUp/SignUp';
import './Navbar.css';
import { Link, animateScroll as scroll } from 'react-scroll';
import Notification from './Notification';

function Navbar() {
  const [showLogin, setShowLogin] = useState(!Cookies.get('jwt'));
  const [userData, setUserData] = useState(null);
  const userId = Cookies.get('userId');
  const userRole = Cookies.get('userRole');
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const token = Cookies.get('jwt');

  const handleAboutClick = () => {
    window.location.href = '/Home';
  };

  const handleTestimonialsClick = () => {
    window.location.href = '/';
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          console.error('Token not found.');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        if (userId && userRole) {
          let endpoint = '';
          if (userRole === 'c') {
            endpoint = `http://176.119.254.188:8080/customer/${userId}`;
          } else if (userRole === 'e') {
            endpoint = `http://176.119.254.188:8080/employee/${userId}`;
          } else if (userRole === 'a') {
            endpoint = `http://176.119.254.188:8080/searchForAdmin/${userId}`;
          }

          const response = await fetch(endpoint);
          if (response.ok) {
            const userData = await response.json();
            setUserData(userData);
          } else {
            console.error('Failed to fetch user data');
          }
          const responseImage = await fetch(`http://176.119.254.188:8080/user`, config);
          if (responseImage.ok) {
            const imageData = await responseImage.blob(); // Convert response to Blob
            const imageUrl = URL.createObjectURL(imageData); // Create a Blob URL
            setProfileImageUrl(imageUrl);
          } else {
            console.error('Failed to fetch profile image');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId, userRole]);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  const handleSignOut = () => {
    Cookies.remove('jwt');
    Cookies.remove('userId');
    Cookies.remove('userRole');
    setShowLogin(true);
  };

  const isCustomer = userRole === 'c';
  const isBabysitter = userRole === 'e';
  const isAdmin = userRole === 'a';

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid">
        <a className="mx-5 navbar-brand" href="#">NannyNet</a>
        <div className="d-flex ms-auto d-lg-none">
          {Cookies.get('jwt') ? (
            <div className="d-flex align-items-center">
              <div className="me-3 icons">
                <Notification />
              </div>
              <div className="dropdown">
                {userData && (
                  <a href="#" className="d-flex align-items-center text-dark link-dark text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src={profileImageUrl || "/images/UserProfile.jpg"} alt="" width={32} height={32} className="rounded-circle me-2" />
                  </a>
                )}
                {userData && (
                  <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
                    {isCustomer && userData.user && (
                      <>
                        <RouterLink to={`/user-profile/${userData.user.id}`} className="dropdown-item">Profile</RouterLink>
                        <RouterLink to={`/UserEditAccount`} className="dropdown-item">Account</RouterLink>
                        <RouterLink to={`/customerBookings/${userData.user.id}`} className="dropdown-item">Bookings</RouterLink>
                        <RouterLink to={`/offerBookings/${userData.user.id}`} className="dropdown-item">Offer Bookings</RouterLink>
                        <RouterLink to={`/Feedback/${userData.user.id}`} className="dropdown-item">Feedback</RouterLink>
                        <RouterLink to={`/CustomerNotification/${userData.user.id}`} className="dropdown-item">Notification</RouterLink>
                      </>
                    )}
                    {isBabysitter && userData.user && (
                      <>
                        <RouterLink to={`/babysitter-profile/${userData.user.id}`} className="dropdown-item">Profile</RouterLink>
                        <RouterLink to={`/BabysitterEditAccount`} className="dropdown-item">Account</RouterLink>
                        <RouterLink to={`/BabysitterBookings/${userData.user.id}`} className="dropdown-item">Orders</RouterLink>
                        <RouterLink to={`/BabysitterFeedback/${userData.user.id}`} className="dropdown-item">Feedback</RouterLink>
                        <RouterLink to={`/BabysitterNotification/${userData.user.id}`} className="dropdown-item">Notification</RouterLink>
                      </>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li><RouterLink to="/Home" className="dropdown-item redText" onClick={handleSignOut}>Sign out</RouterLink></li>
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <span className="d-flex">
              <div className='me-3 icons'>
                <i className="fa-solid fa-bell" onClick={() => <Notification />} />
              </div>
              {showLogin ? <Login toggleForm={toggleForm} /> : <SignUp toggleForm={toggleForm} />}
            </span>
          )}
        </div>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse ms-5 ps-5" id="navbarSupportedContent">
          <ul className="navbar-nav">
            <li className="nav-item me-5">
              <RouterLink to="/Home" className="nav-link active">Home</RouterLink>
            </li>
            <li className="nav-item me-5">
              <RouterLink to="/service" className="nav-link">Services</RouterLink>
            </li>
            <li className="nav-item me-5">
              <Link activeClass="active" to="Contact" spy={true} smooth={true} offset={-90} duration={500} className="nav-link">Contact</Link>
            </li>
            <li className="nav-item me-3">
              <RouterLink to="/BabysittersList" className="nav-link">Book Online</RouterLink>
            </li>
            {Cookies.get('jwt') && userId && isCustomer && (
              <li className="nav-item me-3">
                <RouterLink to={`/FastBooking/${userId}`} className="nav-link">Fast Booking</RouterLink>
              </li>
            )}
            {Cookies.get('jwt') && userId && isCustomer && (
              <li className="nav-item me-3">
                <RouterLink to={`/offers/${userId}`} className="nav-link position-relative">
                  Special Offers
                </RouterLink>
              </li>
            )}
          </ul>
          <div className="d-none d-lg-flex ms-auto me-5 pe-5">
            {Cookies.get('jwt') ? (
              <div className="d-flex align-items-center ">
                <div className="me-3 icons">
                  <Notification />
                </div>
                <div className="dropdown">
                  {userData && (
                    <a href="#" className="d-flex align-items-center text-dark link-dark text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
                      <img src={profileImageUrl || "/images/UserProfile.jpg"} alt="" width={32} height={32} className="rounded-circle me-2" />
                    </a>
                  )}
                  {userData && (
                    <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
                      {isCustomer && userData.user && (
                        <>
                          <RouterLink to={`/user-profile/${userData.user.id}`} className="dropdown-item">Profile</RouterLink>
                          <RouterLink to={`/UserEditAccount`} className="dropdown-item">Account</RouterLink>
                          <RouterLink to={`/customerBookings/${userData.user.id}`} className="dropdown-item">Bookings</RouterLink>
                          <RouterLink to={`/offerBookings/${userData.user.id}`} className="dropdown-item">Offer Bookings</RouterLink>
                          <RouterLink to={`/Feedback/${userData.user.id}`} className="dropdown-item">Feedback</RouterLink>
                          <RouterLink to={`/CustomerNotification/${userData.user.id}`} className="dropdown-item">Notification</RouterLink>
                        </>
                      )}
                      {isBabysitter && userData.user && (
                        <>
                          <RouterLink to={`/babysitter-profile/${userData.user.id}`} className="dropdown-item">Profile</RouterLink>
                          <RouterLink to={`/BabysitterEditAccount`} className="dropdown-item">Account</RouterLink>
                          <RouterLink to={`/BabysitterBookings/${userData.user.id}`} className="dropdown-item">Orders</RouterLink>
                          <RouterLink to={`/BabysitterFeedback/${userData.user.id}`} className="dropdown-item">Feedback</RouterLink>
                          <RouterLink to={`/BabysitterNotification/${userData.user.id}`} className="dropdown-item">Notification</RouterLink>
                        </>
                      )}
                      <li><hr className="dropdown-divider" /></li>
                      <li><RouterLink to="/Home" className="dropdown-item redText" onClick={handleSignOut}>Sign out</RouterLink></li>
                    </ul>
                  )}
                </div>
              </div>
            ) : (
              <span className="d-flex">
                <div className='me-3 icons'>
                  <i className="fa-solid fa-bell" onClick={() => <Notification />} />
                </div>
                {showLogin ? <Login toggleForm={toggleForm} /> : <SignUp toggleForm={toggleForm} />}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

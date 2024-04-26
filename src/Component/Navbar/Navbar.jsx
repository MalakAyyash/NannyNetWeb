import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useHistory, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import Login from '../Login/Login';
import SignUp from '../SignUp/SignUp';
import './Navbar.css';
import { Link, animateScroll as scroll } from 'react-scroll';
// import {useHistory, useLocation } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';

function Navbar() {
  const [showLogin, setShowLogin] = useState(!Cookies.get('jwt'));
  const [userData, setUserData] = useState(null);
  const userId = Cookies.get('userId');
  const userRole = Cookies.get('userRole');

  const [scrollToAbout, setScrollToAbout] = useState(false);


  const handleAboutClick = () => {
    // Trigger navigation to the home page first
    window.location.href = '/Home';
  };

  const handleTestimonialsClick = () => {
    // Trigger navigation to the home page first
    window.location.href = '/';
  };

  // useEffect(() => {
  //   const scrollToAboutSection = async () => {
  //     if (window.location.pathname === '/Home')  {
  //       // Wait for the page to load before scrolling
  //       await new Promise((resolve) => setTimeout(resolve, 100));

  //           // Scroll to the "about" section
  //           scroll.scrollTo(document.getElementById('about').offsetTop - 80, {
  //             duration: 500,
  //             smooth: true
  //           });
  //           }
  //           };
      

  //   const scrollToTestimonialsSection = async () => {
  //     if (window.location.pathname === '/')  {
  //       // Wait for the page to load before scrolling
  //       await new Promise((resolve) => setTimeout(resolve, 100));

  //       // Scroll to the "about" section
  //       scroll.scrollTo(document.getElementById('Testimonials').offsetTop - 80, {
  //         duration: 500,
  //         smooth: true
  //       });
  //     }
  //   };

  //   scrollToAboutSection();
  //   scrollToTestimonialsSection();
  // }, []);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userId && userRole) {
          let endpoint = '';
          if (userRole === 'c') {
            endpoint = `http://176.119.254.188:8080/customer/${userId}`;
          } else if (userRole === 'e') {
            endpoint = `http://176.119.254.188:8080/employee/${userId}`;
          }
          else if (userRole === 'a') {
            endpoint = `http://176.119.254.188:8080/searchForAdmin/${userId}`;
          }

          const response = await fetch(endpoint);
          if (response.ok) {
            const userData = await response.json();
            setUserData(userData);
          } else {
            console.error('Failed to fetch user data');
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
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div className="container-fluid">
          <a className="mx-5 navbar-brand" href="#">NannyNet</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse ms-5 ps-5" id="navbarSupportedContent">
            <ul className="navbar-nav">
              <li className="nav-item me-5">
                <RouterLink to="/Home" className="nav-link active">Home</RouterLink>
              </li>
              <li className="nav-item me-5">
                <span className="nav-link" onClick={handleAboutClick}>About</span>
              </li>
              <li className="nav-item me-5">
                <RouterLink to="/service" className="nav-link">Services</RouterLink>
              </li>

              <li className="nav-item me-5">
              <span className="nav-link" onClick={handleTestimonialsClick}>Testimonials</span>

              </li>
              <li className="nav-item me-5">
                <Link activeClass="active" to="Contact" spy={true} smooth={true} offset={-90} duration={500} className="nav-link">Contact</Link>
              </li>
              {/* <li className="nav-item me-3">
                <a className="nav-link" href="#">Blog</a>
              </li> */}
              <li className="nav-item me-3">
                <RouterLink to="/BabysittersList" className="nav-link">Book Online</RouterLink>
              </li>
            </ul>
            <div className="ms-auto pe-5 me-5">
              {Cookies.get('jwt') && !isAdmin ? (
                // If JWT token exists, show user dropdown
                <div className="d-flex align-items-center">
                  <div className='me-3 icons'>
                    <i className="fa-solid fa-bell"></i>
                  </div>
                  <div className="dropdown">
                    {userData && (
                      <a href="#" className="d-flex align-items-center text-dark link-dark text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
                      <img src="/images/UserProfile.jpg" alt width={32} height={32} className="rounded-circle me-2" />
                      </a>
                    )}
                    {userData && (
                    <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
                      {isCustomer && userData.user && (
                        <>
                          <RouterLink to={`/user-profile/${userData.user.id}`} className="dropdown-item">Profile</RouterLink>
                          <RouterLink to={`/user-account`} className="dropdown-item">Account</RouterLink>
                          <RouterLink to={`/customerBookings/${userData.user.id}`} className="dropdown-item">Bookings</RouterLink>
                        </>
                      )}

                      {isBabysitter && userData.user && (
                        <>
                          <RouterLink to={`/babysitter-profile/${userData.user.id}`} className="dropdown-item">Profile</RouterLink>
                          <RouterLink to={`/BabysitterEditAccount`} className="dropdown-item">Account</RouterLink>
                          <RouterLink to={`/BabysitterBookings/${userData.user.id}`} className="dropdown-item">Orders</RouterLink>
                        </>
                      )}
                      <li><hr className="dropdown-divider" /></li>
                      <li><RouterLink to="/Home" className="dropdown-item redText" onClick={handleSignOut}>Sign out</RouterLink></li>
                    </ul>
                    )}
                  </div>
                </div>
              ) : (
                // If JWT token doesn't exist, show login or signup form
                <span className="d-flex ms-5 ps-5 me-5 pe-5">
                  <div className='me-3 icons'>
                    <i className="fa-solid fa-bell"></i>
                  </div>
                  <div className='icons'>
                    <i className="fa-solid fa-circle-user"></i>
                  </div>
                  {showLogin ? <Login toggleForm={toggleForm} /> : <SignUp toggleForm={toggleForm} />}
                </span>
              )}

            </div> {/* End ms-auto */}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
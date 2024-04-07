import React, { useState } from 'react';
import Cookies from 'js-cookie';
import Login from '../Login/Login.jsx';
import SignUp from '../SignUp/SignUp.jsx';
import { Link, animateScroll as scroll } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';

import './Navbar.css';

function Navbar() {
  const [showLogin, setShowLogin] = useState(!Cookies.get('jwt')); // Check if JWT token exists in cookies
  const userId = Cookies.get('userId');


  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  const handleSignOut = () => {
    Cookies.remove('jwt'); // Clear JWT token from cookies
    setShowLogin(true); // Show the login form after sign-out
  };


    return (
        <>
         <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div className="container-fluid">
          <a className="mx-5 navbar-brand" href="#"><img src="../images/logo.png" className="" alt="..." /></a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse justify-content-start ms-4" id="navbarSupportedContent">
            <ul className="navbar-nav">
              <li className="nav-item me-3">
                <RouterLink to="/Home" className="nav-link active">Home</RouterLink>
              </li>
                            <li className="nav-item me-3">
                                <Link activeClass="active" to="about" spy={true} smooth={true} offset={20} duration={500} className="nav-link">About</Link>
                            </li>
                            <li className="nav-item me-3">
                                <RouterLink to="/service" className="nav-link">Services</RouterLink>
                            </li>
                            <li className="nav-item me-3">
                                <a className="nav-link" href="#">Online Programs</a>
                            </li>
                            <li className="nav-item me-3">
                                <Link activeClass="active" to="Testimonials" spy={true} smooth={true} offset={-90} duration={500} className="nav-link">Testimonials</Link>
                            </li>
                            <li className="nav-item me-3">
                                <Link activeClass="active" to="Contact" spy={true} smooth={true} offset={-90} duration={500} className="nav-link">Contact</Link>
                            </li>
                            <li className="nav-item me-3">
                                <a className="nav-link" href="#">Blog</a>
                            </li>
                            <li className="nav-item me-3">
                                <RouterLink to="/BookOnline" className="nav-link">Book Online</RouterLink>
                            </li>
                        </ul>
                        <div className="ms-5 ps-5 me-5 pe-5"> {/* Wrap notification icon and dropdown in ms-auto */}
                        {Cookies.get('jwt') ? (
              // If JWT token exists, show user dropdown
              <div className="d-flex align-items-center">
 <div className='me-3 icons'>
                  <i className="fa-solid fa-bell"></i>
                </div>                
                <div className="dropdown">
                  <a href="#" className="d-flex align-items-center text-dark link-dark text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="/images/UserProfile.jpg" alt width={32} height={32} className="rounded-circle me-2" />
                    
                  </a>
                  <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
                    <li><a className="dropdown-item" href="#">Settings</a></li>
                    
                    <RouterLink to={`/profile`} className="dropdown-item">Profile</RouterLink>

                    {/* <li><a className="dropdown-item" href="#">Profile</a></li> */}
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={handleSignOut}>Sign out</button></li>
                  </ul>
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
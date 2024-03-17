import React, { useState } from 'react';
import Login from '../Login/Login.jsx';
import SignUp from '../SignUp/SignUp.jsx';
import { Link, animateScroll as scroll } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';

import './Navbar.css';


function Navbar() {
    const [showLogin, setShowLogin] = useState(true);

    const toggleForm = () => {
        setShowLogin(!showLogin);
    };
    console.log(showLogin)

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
                        <span class="d-flex ms-5 ps-5">
                            <div className='me-3 icons'>
                                <i className="fa-solid fa-bell"></i>
                            </div>
                            <div className='icons'>
                                <i className="fa-solid fa-circle-user"></i>
                            </div>
                            {showLogin ? <Login toggleForm={toggleForm} /> : <SignUp toggleForm={toggleForm} />}
                        </span>
                    </div>
                </div>
            </nav>

        </>
    )
}
export default Navbar;





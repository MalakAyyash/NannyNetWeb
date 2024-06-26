import React from 'react';
import './AdminNavbar.css';
import Cookies from 'js-cookie'; // Import js-cookie

export default function AdminNavbar() {

    const handleSignOut = () => {
        // Remove authentication cookies
        Cookies.remove('jwt');
        Cookies.remove('userId');
        Cookies.remove('userRole');

        // Redirect to the sign-in page (or any other appropriate page)
        window.location.href = '/home'; // Redirect to the sign-in page after sign-out
    };

    return (
        <nav className="navbar">
            <div className="container-fluid">
                <a className="navbar-brand text-dark">Nanny Net</a>
                <form className="d-flex" role="search">
                    <input className="form-control me-2 w-100 rounded-0" type="search" placeholder="Search" aria-label="Search" />
                    <button className="btn btn-outline-dark rounded-0" type="submit">Search</button>
                </form>
                <div className="d-flex align-items-center">
                    <i className="fa-solid fa-bell me-3 text-dark"></i> 
                    <div className="dropdown">
                        <a href="#" className="d-flex align-items-center text-dark link-dark text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src="https://github.com/mdo.png" alt width={32} height={32} className="rounded-circle me-2" />
                            <strong>mdo</strong>
                        </a>
                        <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
                            <li><a className="dropdown-item" href="#">Settings</a></li>
                            <li><a className="dropdown-item" href="#">Profile</a></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><button className="dropdown-item" onClick={handleSignOut}>Sign out</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}

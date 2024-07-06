import React from 'react';
import './AdminNavbar.css';
import Cookies from 'js-cookie'; // Import js-cookie
import Notification from '../../Component/Navbar/Notification';

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
                <div className="d-flex align-items-center">
                    <span className="d-flex">
                <div className='me-3 icons text-dark'>
                <i className="fa-solid fa-bell" onClick={() => <Notification />} />
                </div>
              </span> 
                    <div className="dropdown">
                        <a href="#" className="d-flex align-items-center text-dark link-dark text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src="/images/admin.png" alt width={32} height={32} className="rounded-circle me-2" />
                        </a>
                        <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
                            <li><button className="dropdown-item" onClick={handleSignOut}>Sign out</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}

import { Link, Link as RouterLink } from 'react-router-dom';
import BabysitterData from '../BabysitterData/BabysitterData';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import Profile from '../Profile/Profile';
import EditAccount from '../EditAccount/EditAccount';
import Bookings from '../Bookings/Bookings';
// import './Profile.css';



function Account() {
    const babysitterData = BabysitterData();
    const { babysitterKey } = useParams();
    const [selectedNavItem, setSelectedNavItem] = useState('profile'); // Initial selection

    const handleNavItemClick = (item) => {
        setSelectedNavItem(item);
    };

    if (babysitterData.hasOwnProperty(babysitterKey)) {
        const selectedBabysitter = babysitterData[babysitterKey];
        const birthDate = new Date(selectedBabysitter.age);
        const formattedDate = birthDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        
        return (
            <>
                <div className='Book-container-fluid '>
                    <div className='Service pt-5 mt-5 mb-3'>
                        <div className='Cover d-flex align-items-center justify-content-start ps-3 '>
                            <div className='photo-container mt-5' style={{ width: '150px', height: '150px', overflow: 'hidden', borderRadius: '50%', margin: '0 20px' }}>
                                <img src={selectedBabysitter.photo} className="card-img-top" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <h2 className='text-light pt-5 mt-5'>{selectedBabysitter.fname} {selectedBabysitter.lname}</h2>
                        </div>
                    </div>
                    <ul class="nav">
                    <li className={`nav-item ${selectedNavItem === 'profile' ? 'active' : ''}`}>
                        <button className="nav-link text-dark" onClick={() => handleNavItemClick('profile')}>Profile</button>
                    </li>
                    <li className={`nav-item ${selectedNavItem === 'bookings' ? 'active' : ''}`}>
                        <button className="nav-link text-dark" onClick={() => handleNavItemClick('bookings')}>My Bookings</button>
                    </li>
                    <li className={`nav-item ${selectedNavItem === 'wallet' ? 'active' : ''}`}>
                        <button className="nav-link text-dark" onClick={() => handleNavItemClick('wallet')}>My Wallet</button>
                    </li>
                    <li className={`nav-item ${selectedNavItem === 'account' ? 'active' : ''}`}>
                        <button className="nav-link text-dark" onClick={() => handleNavItemClick('account')}>My Account</button>
                    </li>
                </ul>
                {selectedNavItem === 'profile' && (
                    <div>
                        <Profile />
                    </div>
                )}
                {selectedNavItem === 'bookings' && (
                    <div>
                        <Bookings />
                    </div>
                )}
                {selectedNavItem === 'wallet' && (
                    <div>
                        
                    </div>
                )}
                {selectedNavItem === 'account' && (
                    <div>
                        <EditAccount />
                    </div>
                )}
                </div>
              
            </>
        )
    }
}
export default Account;
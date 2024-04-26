import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import UpcomingBookings from './UpcomingBookings.jsx';
import HistoryBookings from './HistoryBookings.jsx';
import RequestBookings from './RequestBookings.jsx';




function BabysitterBookings() {
    const [babysitterData, setBabysitterData] = useState(null);
    const [ownerProfile, setOwnerProfile] = useState(false); // State to determine if the viewer is the owner of the profile
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const { id } = useParams(); // Get the ID parameter from the URL
    const [activeTab, setActiveTab] = useState('request');


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                let response;
                if (ownerProfile) {
                    // Fetch user data using the userId from cookies
                    response = await fetch(`http://176.119.254.188:8080/employee/${Cookies.get('userId')}`);
                } else {
                    // Fetch employee data using the id from useParams
                    response = await fetch(`http://176.119.254.188:8080/employee/${id}`);
                }

                if (response.ok) {
                    const data = await response.json();
                    setBabysitterData(data);
                } else {
                    console.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const userId = Cookies.get('userId');
        if (userId) {
            // Check if the user ID in cookies matches the profile user ID
            setOwnerProfile(userId === id);
            fetchUserData();
        }
    }, [id, ownerProfile]);

    // Function to render star rating
    const renderStarRating = (stars) => {
        const starElements = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= stars) {
                // Render a filled star
                starElements.push(<i key={i} className="fa-solid fa-star text-warning"></i>);
            } else {
                // Render an empty star
                starElements.push(<i key={i} className="fa-regular fa-star text-secondary"></i>);
            }
        }
        return starElements;
    };

    if (!babysitterData || !babysitterData.user) {
        return <div>Loading...</div>;
    }

    return (
        <div className='Book-container-fluid'>
            <div className='Service pt-5 mt-5 mb-3'>
                <div className='Cover d-flex align-items-center justify-content-start ps-3'>
                    <div className='photo-container mt-5 me-3 position-relative' style={{ width: '150px', height: '150px', overflow: 'hidden', borderRadius: '50%', zIndex: '1' }}>
                        <img src="/images/UserProfile.jpg" className="card-img-top" alt="Profile" />
                    </div>
                    <div>
                        <h2 className='text-light pt-5 mt-5'>{babysitterData.user.username}</h2>
                        <i className="fa-solid fa-user-tie text-secondary small fs-6">  Babysitter</i>
                    </div>
                </div>
            </div>
            {ownerProfile && (
                <ul className="nav">
                    <li className={`nav-item`}>
                        <RouterLink to={`/babysitter-profile/${babysitterData.user.id}`} className={`nav-link `}>Profile</RouterLink>
                    </li>
                    <li className={`nav-item`}>
                    <RouterLink to={`/BabysitterBookings/${babysitterData.user.id}`} className={`nav-link border-bottom`}>My Orders</RouterLink>
                    </li>
                    <li className={`nav-item`}>
                        <RouterLink to="/my-wallet" className={`nav-link `}>My Wallet</RouterLink>
                    </li>
                    <li className={`nav-item`}>
                    <RouterLink to="/BabysitterEditAccount" className={`nav-link`}>Account</RouterLink>
                    </li>
                </ul>
            )}
            <div className='DetaliedBook mt-5 normalFont'>
    
                <div className='DetaliedBook mt-5'>
                    <div className=''>
                        <p className='pt-2 profileTitle'>Manage Your Orders</p>
                    </div>
                    <p className='small mb-5 '>Stay organized and in control of your schedule.</p>
                    <ul className="nav nav-tabs mb-5">

                    <li className="nav-item">
                            <a className={`nav-link text-dark px-5 ${activeTab === 'request' ? 'active' : ''}`} onClick={() => setActiveTab('request')} href="#">
                                Request
                            </a>
                        </li>
                  
                        <li className="nav-item">
                            <a className={`nav-link text-dark px-5 ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')} href="#">
                                Upcoming
                            </a>
                        </li>

                       
                        <li className="nav-item">
                            <a className={`nav-link px-5 text-dark ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')} href="#">
                                History
                            </a>
                        </li>
                    </ul>
                    <div>
                    {activeTab === 'request' && <RequestBookings />}

                        {activeTab === 'upcoming' && <UpcomingBookings />}
                        {activeTab === 'history' && <HistoryBookings />}

                    </div>
                </div> 
      

                <hr />
            </div>
        </div>
    );
}

export default BabysitterBookings;

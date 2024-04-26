import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import UserRequestBookings from './UserRequestBookings.jsx';
import UserUpcomingBookings from './UserUpcomingBookings.jsx';
import UserHistoryBookings from './UserHistoryBookings.jsx';




function Bookings() {
    const [customerData, setCustomerData] = useState(null);
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
                    response = await fetch(`http://176.119.254.188:8080/customer/${Cookies.get('userId')}`);
                } else {
                    // Fetch employee data using the id from useParams
                    response = await fetch(`http://176.119.254.188:8080/customer/${id}`);
                }

                if (response.ok) {
                    const data = await response.json();
                    setCustomerData(data);
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


    if (!customerData || !customerData.user) {
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
                <h2 className='text-light pt-5 mt-5'>{customerData.user.username}</h2>
                <i className="fa-solid fa-user text-secondary small fs-6 "> Parent</i>
              </div>
            </div>
          </div>
          
          <ul className="nav">
            <li className={`nav-item `}>
              <RouterLink to={`/user-profile/${customerData.user.id}`} className={`nav-link`}>Profile</RouterLink>
            </li>
            <li className={`nav-item`}>
            <RouterLink to={`/customerBookings/${customerData.user.id}`} className={`nav-link border-bottom`}>My Bookings</RouterLink>
            </li>
            <li className={`nav-item`}>
              <button className={`nav-link `} >My Wallet</button>
            </li>
           
              <li className={`nav-item`}>
                <RouterLink to="/UserEditAccount" className={`nav-link `}>Account</RouterLink>
              </li>
            
          </ul>
            
            <div className='DetaliedBook mt-5 normalFont'>
    
                <div className='DetaliedBook mt-5'>
                    <div className=''>
                        <p className='pt-2 profileTitle'>Manage Your Bookings</p>
                    </div>
                    <p className='small mb-5 '>Stay organized and in control of your schedule.</p>
                    <ul className="nav nav-tabs mb-5">

                    <li className="nav-item">
                            <a className={`nav-link text-dark px-5 ${activeTab === 'request' ? 'active' : ''}`} onClick={() => setActiveTab('request')} href="#">
                                Pinding
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
                    {activeTab === 'request' && <UserRequestBookings />}

                        {activeTab === 'upcoming' && <UserUpcomingBookings />}
                        {activeTab === 'history' && <UserHistoryBookings />}


                    </div>
                </div> 
      

                <hr />
            </div>
        </div>
    );
}

export default Bookings;

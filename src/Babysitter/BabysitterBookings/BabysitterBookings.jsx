import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import UpcomingBookings from './UpcomingBookings.jsx';
import HistoryBookings from './HistoryBookings.jsx';
import RequestBookings from './RequestBookings.jsx';
import BabysitterSubmitted from './BabysitterSubmitted.jsx';
import BabysitterSceduleTable from './BabysitterSceduleTable.jsx';


function BabysitterBookings() {
    const [babysitterData, setBabysitterData] = useState(null);
    const [ownerProfile, setOwnerProfile] = useState(false); // State to determine if the viewer is the owner of the profile
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const { id } = useParams(); // Get the ID parameter from the URL
    const [activeTab, setActiveTab] = useState('request');
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const token = Cookies.get('jwt');

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

                const responseImage = await fetch(`http://176.119.254.188:8080/user/image/${id}`);
                if (responseImage.ok) {
                  const imageData = await responseImage.blob(); // Convert response to Blob
                  const imageUrl = URL.createObjectURL(imageData); // Create a Blob URL
                  setProfileImageUrl(imageUrl);
                } else {
                  console.error('Failed to fetch profile image');
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
    }, [id, ownerProfile,profileImageUrl]);

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
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
    
        try {
          const response = await fetch('http://176.119.254.188:8080/upload/profile/image', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });
    
          if (response.ok) {
            const updatedImageUrl = await response.text();
            setProfileImageUrl(updatedImageUrl);
          } else {
            console.error('Failed to upload image');
          }
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      };


    if (!babysitterData || !babysitterData.user) {
        return <div>Loading...</div>;
    }

    return (
        <div className='Book-container-fluid'>
          <div className='Service pt-5 mt-5 mb-3'>
        <div className='Cover d-flex align-items-center justify-content-start ps-3'>
          <div className='position-relative'>
            <div className='photo-container mt-5 me-3 position-relative'>
                <label htmlFor="image-upload">
                  <i className="fa-solid fa-camera position-absolute bottom-0 start-0 translate-middle mb-1 ms-3 text-dark rounded p-1"
                     style={{ fontSize: '24px' }}
                     data-bs-toggle="tooltip"
                     data-bs-placement="top"
                     title="Change Your Image"
                  ></i>
                </label>
              <div className="rounded-circle rounded-circle-container overflow-hidden">
                <img src={profileImageUrl || "/images/UserProfile.jpg"} className="card-img-top" alt="Profile" />
              </div>
              <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="input-file" />
            </div>
          </div>

          <div>
            <h2 className='text-light'>{babysitterData.user.username}</h2>
            <i className="fa-solid fa-user-tie text-secondary small fs-6">Babysitter</i>
            </div>
        </div>
      </div>
            {ownerProfile && (
                <ul className="nav d-none d-md-flex">
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
                <RouterLink to={`/BabysitterFeedback/${babysitterData.user.id}`} className={`nav-link`}>Feedback</RouterLink>
                </li>
                    <li className={`nav-item`}>
                    <RouterLink to="/BabysitterEditAccount" className={`nav-link`}>Account</RouterLink>
                    </li>
                    <li className={`nav-item`}>
                <RouterLink to={`/BabysitterNotification/${babysitterData.user.id}`} className={`nav-link`}>Notification</RouterLink>
                </li>
                </ul>
            )}
              <div className="d-md-none">
        <div>
          <hr />
          <div className="btn-group w-100">
            My Orders
            <button type="button" className="btn btn-secondary dropdown-toggle border-0 dropdown-toggle-split d-flex justify-content-end px-0" data-bs-toggle="dropdown" aria-expanded="false">
              <span className="visually-hidden">Toggle Dropdown</span>
            </button>
            <ul className="dropdown-menu w-100">
              <div id="mobile-nav" className="mt-2">
              <RouterLink to={`/babysitter-profile/${babysitterData.user.id}`} className={`nav-link border-bottom`}>Profile</RouterLink>
                <RouterLink to={`/BabysitterFeedback/${babysitterData.user.id}`} className={`nav-link d-block mb-2`}>Feedback</RouterLink>
                <RouterLink to={`/BabysitterNotification/${babysitterData.user.id}`} className={`nav-link d-block mb-2`}>Notification</RouterLink>
                <RouterLink to="/BabysitterEditAccount" className={`nav-link`}>Account</RouterLink>
                <button className={`nav-link d-block mb-2`}>My Wallet</button>
              </div>
            </ul>
          </div>
        </div>

      </div>
      <hr />
            <div className='DetaliedBook normalFont'>
    
                <div className='DetaliedBook'>
                    <div className=''>
                        <p className='profileTitle'>Manage Your Orders</p>
                    </div>
                    <p className='small mb-5 profileDate '>Stay organized and in control of your schedule.</p>
                    <ul className="nav nav-tabs mb-5">

                    <li className="nav-item">
                            <a className={`nav-link text-dark ${activeTab === 'request' ? 'active' : ''}`} onClick={() => setActiveTab('request')} href="#">
                                Request
                            </a>
                        </li>
                  
                        <li className="nav-item">
                            <a className={`nav-link text-dark ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')} href="#">
                                Upcoming
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link text-dark ${activeTab === 'submitted' ? 'active' : ''}`} onClick={() => setActiveTab('submitted')} href="#">
                                Submitted
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link text-dark ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')} href="#">
                                History
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link text-dark ${activeTab === 'scedule' ? 'active' : ''}`} onClick={() => setActiveTab('scedule')} href="#">
                                Your Scedule
                            </a>
                        </li>
                    </ul>
                    <div>
                    {activeTab === 'request' && <RequestBookings />}
                    {activeTab === 'upcoming' && <UpcomingBookings />}
                    {activeTab === 'history' && <HistoryBookings />}
                    {activeTab === 'submitted' && <BabysitterSubmitted />}
                    {activeTab === 'scedule' && <BabysitterSceduleTable />}
                    </div>
                </div> 
                <hr />
            </div>
        </div>
    );
}

export default BabysitterBookings;

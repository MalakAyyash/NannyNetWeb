import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import BabysitterViewFeedback from './BabysitterViewFeedback';




function BabysitterFeedback() {
    const [babysitterData, setBabysitterData] = useState(null);
    const [ownerProfile, setOwnerProfile] = useState(false); // State to determine if the viewer is the owner of the profile
    const { id } = useParams(); // Get the ID parameter from the URL
    const [activeTab, setActiveTab] = useState('ViewFeedback');
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
                  const imageData = await responseImage.blob();
                  const imageUrl = URL.createObjectURL(imageData);
                  setProfileImageUrl(imageUrl);
                } else {
                  console.error('Failed to fetch profile image');
                }


            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const userId = Cookies.get('userId');
        console.log(Cookies.get('userId'))
        if (userId) {
            // Check if the user ID in cookies matches the profile user ID
            setOwnerProfile(userId === id);
            fetchUserData();
        }
    }, [id, ownerProfile,profileImageUrl]);

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
                  <i className="fa-solid fa-camera position-absolute bottom-0 start-0 translate-middle mb-1 ms-3 text-dark rounded bg-light p-1"
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
            <h2 className='text-light pt-5 mt-5'>{babysitterData.user.username}</h2>
            <i className="fa-solid fa-user-tie text-secondary small fs-6">Babysitter</i>
            </div>
        </div>
      </div>
        {ownerProfile && (
            <ul className="nav">
                <li className={`nav-item`}>
                    <RouterLink to={`/babysitter-profile/${babysitterData.user.id}`} className={`nav-link`}>Profile</RouterLink>
                </li>
                <li className={`nav-item`}>
                    <RouterLink to={`/BabysitterBookings/${babysitterData.user.id}`} className={`nav-link `}>My Orders</RouterLink>
                </li>
                <li className={`nav-item`}>
                    <RouterLink to="/my-wallet" className={`nav-link `}>My Wallet</RouterLink>
                </li>
                <li className={`nav-item`}>
                <RouterLink to={`/BabysitterFeedback/${babysitterData.user.id}`} className={`nav-link border-bottom`}>Feedback</RouterLink>
                </li>
                <li className={`nav-item`}>
                <RouterLink to="/BabysitterEditAccount" className={`nav-link `}>Account</RouterLink>
                </li>
                <li className={`nav-item`}>
                <RouterLink to={`/BabysitterNotification/${babysitterData.user.id}`} className={`nav-link`}>Notification</RouterLink>
                </li>
            </ul>
        )}
            
            <div className='DetaliedBook mt-5 normalFont'>
    
                <div className='DetaliedBook mt-5'>
                    <div className=''>
                        <p className='pt-2 profileTitle'>View Your Feedbacks</p>
                    </div>
                    <p className='small mb-5 '>Stay organized and in control of your feedbacks.</p>
                    <ul className="nav nav-tabs mb-5">

                    <li className="nav-item">
                            <a className={`nav-link text-dark px-5 ${activeTab === 'ViewFeedback' ? 'active' : ''}`} onClick={() => setActiveTab('ViewFeedback')} href="#">
                                All Feedbacks
                            </a>
                        </li>
                  
                    </ul>
                    <div>
                    {activeTab === 'ViewFeedback' && <BabysitterViewFeedback />}

                        {/* {activeTab === 'upcoming' && <UserUpcomingBookings />}
                        {activeTab === 'history' && <UserHistoryBookings />} */}


                    </div>
                </div> 
      

                <hr />
            </div>
        </div>
    );
}

export default BabysitterFeedback;

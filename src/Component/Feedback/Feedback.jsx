import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import LeaveFeedback from './LeaveFeedback.jsx';
import AllFeedback from './AllFeedback.jsx';
import ParentFeedback from './ParentFeedback.jsx';
// import AllFeedback from './AllFeedback.jsx';





function Feedback() {
    const [customerData, setCustomerData] = useState(null);
    const [ownerProfile, setOwnerProfile] = useState(false); // State to determine if the viewer is the owner of the profile
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const { id } = useParams(); // Get the ID parameter from the URL
    const [activeTab, setActiveTab] = useState('AllFeedback');
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
      


    if (!customerData || !customerData.user) {
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
            <h2 className='text-light'>{customerData.user.username}</h2>
            <i className="fa-solid fa-user text-secondary small fs-6"> Parent</i>
          </div>
        </div>
      </div>
      {ownerProfile && (
          <ul className="nav d-none d-md-flex">
            <li className={`nav-item `}>
              <RouterLink to={`/user-profile/${customerData.user.id}`} className={`nav-link`}>Profile</RouterLink>
            </li>
            <li className={`nav-item`}>
            <RouterLink to={`/customerBookings/${customerData.user.id}`} className={`nav-link`}>My Bookings</RouterLink>
            </li>
            <li className={`nav-item`}>
            <RouterLink to={`/offerBookings/${customerData.user.id}`} className={`nav-link`}>My Offer Bookings</RouterLink>
          </li>
            <li className={`nav-item`}>
              <button className={`nav-link `} >My Wallet</button>
            </li>
            <li className={`nav-item`}>
        <RouterLink to={`/Feedback/${customerData.user.id}`} className={`nav-link border-bottom`}>Feedback</RouterLink>
        </li>
        <li className={`nav-item`}>
            <RouterLink to={`/CustomerNotification/${customerData.user.id}`} className={`nav-link`}>Notification</RouterLink>
          </li>
              <li className={`nav-item`}>
                <RouterLink to="/UserEditAccount" className={`nav-link `}>Account</RouterLink>
              </li>
            
          </ul>
      )}
        <div className="d-md-none">
        <div>
          <hr />
          <div className="btn-group w-100">
             Feedback
            <button type="button" className="btn btn-secondary dropdown-toggle border-0 dropdown-toggle-split d-flex justify-content-end px-0" data-bs-toggle="dropdown" aria-expanded="false">
              <span className="visually-hidden">Toggle Dropdown</span>
            </button>
            <ul className="dropdown-menu w-100">
              <div id="mobile-nav" className="mt-2">
              <RouterLink to={`/user-profile/${customerData.user.id}`} className={`nav-link`}>Profile</RouterLink>
              <RouterLink to={`/customerBookings/${customerData.user.id}`} className={`nav-link d-block mb-2`}>My Bookings</RouterLink>
                <RouterLink to={`/offerBookings/${customerData.user.id}`} className={`nav-link d-block mb-2`}>My Offer Bookings</RouterLink>
                <RouterLink to={`/CustomerNotification/${customerData.user.id}`} className={`nav-link d-block mb-2`}>Notification</RouterLink>
                <button className={`nav-link d-block mb-2`}>My Wallet</button>
              </div>
            </ul>
          </div>
        </div>
      </div>
      <hr />
            
            <div className='DetaliedBook  normalFont'>
    
                <div className='DetaliedBook '>
                    <div className=''>
                    <p className='pt-2 profileTitle mb-5'>View Feedbacks</p>
                    </div>
                    <ul className="nav nav-tabs mb-5">
                    {ownerProfile && (
                    <li className="nav-item">
                            <a className={`nav-link text-dark px-3 ${activeTab === 'AllFeedback' ? 'active' : ''}`} onClick={() => setActiveTab('AllFeedback')} href="#">
                                All Feedbacks
                            </a>
                        </li>
                    )}
                        {ownerProfile && (

                        <li className="nav-item">
                            <a className={`nav-link text-dark px-3 ${activeTab === 'LeaveFeedback' ? 'active' : ''}`} onClick={() => setActiveTab('LeaveFeedback')} href="#">
                                Leave Feedback
                            </a>
                        </li>
                        )}
                          {!ownerProfile && (

                            <li className="nav-item">
                                <a className={`nav-link text-dark px-5 ${activeTab === 'AllFeedback' ? 'active' : ''}`} onClick={() => setActiveTab('AllFeedback')} href="#">
                                    All Feedbacks
                                </a>
                            </li>
                            )}
                  
                         
                    </ul>
                    <div>
                      
                    {activeTab === 'LeaveFeedback' && ownerProfile && <LeaveFeedback />}
                    {activeTab === 'AllFeedback' && ownerProfile && <AllFeedback />}
                    {activeTab === 'AllFeedback' && !ownerProfile && <ParentFeedback id={id} />}

                    </div>
                </div> 
      

                <hr />
            </div>
        </div>
    );
}

export default Feedback;

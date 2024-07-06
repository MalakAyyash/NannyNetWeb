import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';


function BabysitterProfile() {
    const [babysitterData, setBabysitterData] = useState(null);
    const [ownerProfile, setOwnerProfile] = useState(false); // State to determine if the viewer is the owner of the profile
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const { id } = useParams(); // Get the ID parameter from the URL
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
                        <RouterLink to={`/babysitter-profile/${babysitterData.user.id}`} className={`nav-link border-bottom`}>Profile</RouterLink>
                    </li>
                    <li className={`nav-item`}>
                        <RouterLink to={`/BabysitterBookings/${babysitterData.user.id}`} className={`nav-link `}>My Orders</RouterLink>
                    </li>
                    <li className={`nav-item`}>
                        <RouterLink to="/my-wallet" className={`nav-link `}>My Wallet</RouterLink>
                    </li>
                    <li className={`nav-item`}>
                <RouterLink to={`/BabysitterFeedback/${babysitterData.user.id}`} className={`nav-link`}>Feedback</RouterLink>
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
                <div className="row">
                    <div className="col-md-10">
                        <p className='pt-2 profileTitle'>Profile</p>
                        <p className='profileDate small'>Join date: {new Date(babysitterData.user.dateAdded).toLocaleDateString('en-US', options)}</p>
                        <p className='text-dark normalFont'>
                            {renderStarRating(babysitterData.stars)}
                        </p>
                    </div>
                    <div className='d-flex m-auto p-3 col-md-2'>
                        {ownerProfile && (
                            <div className='border-0 fs-6 redColor text-light normalFont rounded-0 w-100 p-2'>
                                <RouterLink to="/BabysitterEditAccount" className="text-decoration-none d-flex justify-content-center text-light">Edit Account</RouterLink>
                            </div>
                        )}
                           {!ownerProfile && (
                            <div className='border-0 fs-6 redColor text-light normalFont rounded-0 w-100 p-2'>
                                <RouterLink to={`/BabysitterFeedback/${babysitterData.user.id}`} className="text-decoration-none d-flex justify-content-center text-center text-light">Feedbacks</RouterLink>
                            </div>
                        )}
                    </div>
                </div>
                <hr />
                <div className='row mb-5 pb-5'>
                    <div className='col-md-8'>
                        <div className='d-flex justify-content-center m-auto m-5'>
                            <div className='m-5 pt-5'>
                                {ownerProfile ? (
                                    <div>
                                        <p>You haven't written anything yet!</p>
                                        <p className=''><RouterLink to="/BabysitterEditAccount" className="d-flex justify-content-center text-dark small">Write Your First About </RouterLink></p>
                                    </div>
                                ) : (
                                    <p>{babysitterData.user.name} hasn't written anything yet!</p>
                                )}

                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 pt-4 px-5">
                        <div className="BookingForm">
                            <p className='normalFont'>Profile Details</p>
                            <div className='mt-4 my-3 py-3 ServiceDeatils'>
                                <p className='text-dark normalFont'><i className="fa-solid fa-user pe-3"></i>{babysitterData.user.name}</p>
                                <p className='normalFont'><i className="fa-solid fa-envelope pe-3"></i>{babysitterData.user.email}</p>
                                {ownerProfile && (<p className='text-dark normalFont'><i className="fa-solid fa-phone pe-3"></i>{babysitterData.user.telNumber}</p> )}
                                <p className='normalFont'><i className="fa-solid fa-venus-mars pe-3"></i>{babysitterData.user.gender}</p>
                                <p className='normalFont'><i className="fa-solid fa-location-dot pe-3"></i>{babysitterData.city}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
            </div>
        </div>
    );
}

export default BabysitterProfile;

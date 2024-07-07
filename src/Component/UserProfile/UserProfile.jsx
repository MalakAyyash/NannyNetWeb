import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import './UserProfile.css';

function UserProfile() {
  const [customerData, setCustomerData] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const { id } = useParams();
  const loggedInUserId = Cookies.get('userId');
  const token = Cookies.get('jwt');
  const [showMenu, setShowMenu] = useState(false); // State for toggling menu

  const isOwnProfile = id === loggedInUserId;

  useEffect(() => {
    const fetchCustomerData = async () => {
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

        const response = await fetch(`http://176.119.254.188:8080/customer/${id}`, config);
        if (response.ok) {
          const data = await response.json();
          setCustomerData(data);
        } else {
          console.error('Failed to fetch customer data');
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
        console.error('Error fetching customer data:', error);
      }
    };

    if (id) {
      fetchCustomerData();
    }
  }, [id, profileImageUrl]);

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
              {isOwnProfile && (
                <label htmlFor="image-upload">
                  <i className="fa-solid fa-camera position-absolute bottom-0 start-0 translate-middle mb-1 ms-3 text-dark rounded p-1"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Change Your Image"
                  ></i>
                </label>
              )}
              <div className="rounded-circle rounded-circle-container overflow-hidden">
                <img src={profileImageUrl || "/images/UserProfile.jpg"} className="card-img-top" alt="Profile" />
              </div>
              <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="input-file" />
            </div>
          </div>

          <div >
            <h2 className='text-light'>{customerData.user.username}</h2>
            <i className="fa-solid fa-user text-secondary small"> Parent</i>
          </div>
        </div>
      </div>

      {isOwnProfile && (
        <ul className="nav d-none d-md-flex">
          <li className={`nav-item`}>
            <RouterLink to={`/user-profile/${customerData.user.id}`} className={`nav-link border-bottom`}>Profile</RouterLink>
          </li>
          <li className={`nav-item`}>
            <RouterLink to={`/customerBookings/${customerData.user.id}`} className={`nav-link`}>My Bookings</RouterLink>
          </li>
          <li className={`nav-item`}>
            <RouterLink to={`/offerBookings/${customerData.user.id}`} className={`nav-link`}>My Offer Bookings</RouterLink>
          </li>
          <li className={`nav-item`}>
            <button className={`nav-link`}>My Wallet</button>
          </li>
          <li className={`nav-item`}>
            <RouterLink to={`/Feedback/${customerData.user.id}`} className={`nav-link`}>Feedback</RouterLink>
          </li>
          <li className={`nav-item`}>
            <RouterLink to={`/CustomerNotification/${customerData.user.id}`} className={`nav-link`}>Notification</RouterLink>
          </li>
          {isOwnProfile && (
            <li className={`nav-item`}>
              <RouterLink to="/UserEditAccount" className={`nav-link`}>Account</RouterLink>
            </li>
          )}
        </ul>
      )}
      {/* Mobile Menu Toggle */}
      <div className="d-md-none">
        <div>
          <hr />
          <div className="btn-group w-100">
            Profile
            <button type="button" className="btn btn-secondary dropdown-toggle border-0 dropdown-toggle-split d-flex justify-content-end px-0" data-bs-toggle="dropdown" aria-expanded="false">
              <span className="visually-hidden">Toggle Dropdown</span>
            </button>
            <ul className="dropdown-menu w-100">
              <div id="mobile-nav" className="mt-2">
                <RouterLink to={`/customerBookings/${customerData.user.id}`} className={`nav-link d-block mb-2`}>My Bookings</RouterLink>
                <RouterLink to={`/offerBookings/${customerData.user.id}`} className={`nav-link d-block mb-2`}>My Offer Bookings</RouterLink>
                <RouterLink to={`/Feedback/${customerData.user.id}`} className={`nav-link d-block mb-2`}>Feedback</RouterLink>
                <RouterLink to={`/CustomerNotification/${customerData.user.id}`} className={`nav-link d-block mb-2`}>Notification</RouterLink>
                <RouterLink to="/UserEditAccount" className={`nav-link`}>Account</RouterLink>
                <button className={`nav-link d-block mb-2`}>My Wallet</button>
              </div>
            </ul>
          </div>
        </div>

      </div>
      <hr />
      {/* Existing content */}
      <div className='DetaliedBook normalFont'>
        <div className="row">
          <div className="col-md-10">
            <p className='pt-2 profileTitle'>Profile</p>
            <p className='profileDate small'>Join date: {new Date(customerData.user.dateAdded).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          {isOwnProfile && (
            <div className='d-flex m-auto p-3 col-md-2'>
              <div className='border-0 fs-6 redColor text-light normalFont rounded-0 w-100 p-2'>
                <RouterLink to="/UserEditAccount" className="text-decoration-none d-flex justify-content-center text-light">Edit Account</RouterLink>
              </div>
            </div>
          )}
        </div>
        <hr />

        <div className="d-md-none d-md-flex">
          <div className="BookingForm">
            <div className='mt-2 ServiceDeatils '>
              <p className='text-dark normalFont'><i className="fa-solid fa-user pe-3"></i>{customerData.user.name}</p>
              <p className='normalFont'><i className="fa-solid fa-envelope pe-3"></i>{customerData.user.email}</p>
              {isOwnProfile && (<p className='text-dark normalFont'><i className="fa-solid fa-phone pe-3"></i>{customerData.user.telNumber}</p>)}
              <p className='normalFont'><i className="fa-solid fa-venus-mars pe-3"></i>{customerData.user.gender}</p>
              <p className='normalFont'><i className="fa-solid fa-location-dot pe-3"></i>{customerData.location.city}</p>
            </div>
          </div>
        </div>
        <div className='row  pb-5'>
          <div className='col-md-8'>
            <div className='d-flex justify-content-center m-auto '>
              <div className=' pt-5'>
                {isOwnProfile ? (
                  <p>You haven't written anything yet!</p>
                ) : (
                  <p>{customerData.user.name} hasn't written anything yet!</p>
                )}
                {isOwnProfile && (
                  <p><RouterLink to="/UserEditAccount" className="d-flex justify-content-center text-dark small">Write Your First About</RouterLink></p>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-4 pt-4 px-5 d-none d-md-block">
            <div className="BookingForm">
              <p className='normalFont'>Profile Details</p>
              <div className='mt-4 my-3 py-3 ServiceDeatils'>
                <p className='text-dark normalFont'><i className="fa-solid fa-user pe-3"></i>{customerData.user.name}</p>
                <p className='normalFont'><i className="fa-solid fa-envelope pe-3"></i>{customerData.user.email}</p>
                {isOwnProfile && (<p className='text-dark normalFont'><i className="fa-solid fa-phone pe-3"></i>{customerData.user.telNumber}</p>)}
                <p className='normalFont'><i className="fa-solid fa-venus-mars pe-3"></i>{customerData.user.gender}</p>
                <p className='normalFont'><i className="fa-solid fa-location-dot pe-3"></i>{customerData.location.city}</p>
              </div>
            </div>
          </div>
        </div>
        <hr />
      </div>
    </div>
  );
}

export default UserProfile;

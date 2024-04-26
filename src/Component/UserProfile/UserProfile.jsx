import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import './UserProfile.css';

function UserProfile() {
  const [customerData, setCustomerData] = useState(null);
  const { id } = useParams();
  const loggedInUserId = Cookies.get('userId');
  const isOwnProfile = id === loggedInUserId;

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await fetch(`http://176.119.254.188:8080/customer/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCustomerData(data);
        } else {
          console.error('Failed to fetch customer data');
        }
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    };

    if (id) {
      fetchCustomerData();
    }

  }, [id]);

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
      {isOwnProfile && (
      <ul className="nav">
        <li className={`nav-item `}>
          <RouterLink to={`/user-profile/${customerData.user.id}`} className={`nav-link border-bottom`}>Profile</RouterLink>
        </li>
        <li className={`nav-item`}>
        <RouterLink to={`/customerBookings/${customerData.user.id}`} className={`nav-link `}>My Bookings</RouterLink>
        </li>
        <li className={`nav-item`}>
          <button className={`nav-link `} >My Wallet</button>
        </li>
        {isOwnProfile && (
          <li className={`nav-item`}>
            <RouterLink to="/UserEditAccount" className={`nav-link `}>Account</RouterLink>
          </li>
        )}
      </ul>
        )}
      <div className='DetaliedBook mt-5 normalFont'>
        <div className="row">
          <div className="col-md-10">
            <p className='pt-2 profileTitle'>Profile</p>
            <p className='profileDate small'>Join date: {new Date(customerData.user.dateAdded).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          {isOwnProfile && (
            <div className='d-flex m-auto p-3 col-md-2'>
              <div className='border-0 fs-6 redColor text-light normalFont rounded-0 w-100 p-2 '>
                <RouterLink to="/UserEditAccount" className=" text-decoration-none d-flex justify-content-center text-light">Edit Account</RouterLink>
              </div>
            </div>
          )}
        </div>
        <hr />
        <div className='row mb-5 pb-5'>
          <div className='col-md-8'>
            <div className='d-flex justify-content-center m-auto m-5'>
              <div className='m-5 pt-5'>
              {isOwnProfile ? (
                <p>You haven't written anything yet!</p>
                ):(
                    <p>{customerData.user.name} hasn't written anything yet!</p>

                )}
                {isOwnProfile && (
                  <p className=''><RouterLink to="/UserEditAccount" className="d-flex justify-content-center text-dark small">Write Your First About</RouterLink></p>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-4 pt-4 px-5">
            <div className="BookingForm">
              <p className='normalFont'>Profile Details</p>
              <div className='mt-4 my-3 py-3 ServiceDeatils'>
                <p className='text-dark normalFont'><i className="fa-solid fa-user pe-3"></i>{customerData.user.name}</p>
                <p className='normalFont'><i className="fa-solid fa-envelope pe-3"></i>{customerData.user.email}</p>
                {isOwnProfile && (<p className='text-dark normalFont'><i className="fa-solid fa-phone pe-3"></i>{customerData.user.telNumber}</p>  )}
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

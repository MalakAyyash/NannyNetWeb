import React from 'react';
import './UserProfile.css';
import { Link } from 'react-router-dom';

function UserProfile({ name, username, email, telNumber, describtion, gender, role, dateAdded, locations, handleClick }) {
    const joinDate = typeof dateAdded === 'string' ? new Date(dateAdded) : dateAdded;
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return (
        <div className='DetaliedBook mt-5 normalFont'>
            <div className="row">
                <div className="col-md-10">
                    <p className='pt-2 profileTitle'>Profile</p>
                    <p className='profileDate small'>Join date: {joinDate.toLocaleDateString('en-US', options)}</p>
                </div>
                <div className='d-flex m-auto p-3 col-md-2'>
                    <button className='border-0 fs-6 redColor text-light normalFont rounded-0 w-100 p-2' onClick={event => handleClick(true)}>
                        <i className="fa-solid fa-pen pe-3"></i>Edit Account
                    </button>
                </div>
            </div>
            <hr />
            <div className='row mb-5 pb-5'>
                <div className='col-md-8'>
                    <p className='mt-5 normalFont'>About</p>
                    <div className="form-floating">
                        <textarea className="form-control w-100 pb-5 h-100" placeholder="Share something about yourself..." id="floatingTextarea"></textarea>
                        <button className=' mt-1 px-5 fs-6 borderRed borderRedtext-light normalFont rounded-0 d-flex ms-auto p-2'>Save</button>
                    </div>
                </div>
                <div className="col-md-4 pt-4 px-5">
                    <div className="BookingForm">
                        <p className='normalFont'>Profile Details</p>
                        <div className='mt-4 my-3 py-3 ServiceDeatils'>
                            <p className='text-dark normalFont'><i className="fa-solid fa-user pe-3"></i>{name}</p>
                            <p className='normalFont'><i className="fa-solid fa-envelope pe-3"></i>{email}</p>
                            <p className='text-dark normalFont'><i className="fa-solid fa-phone pe-3"></i>{telNumber}</p>
                            <p className='normalFont'><i className="fa-solid fa-venus-mars pe-3"></i>{gender}</p>
                            {locations.map((location) => (
                                <span key={location.id}>
                                    <i className="fa-solid fa-location-dot pe-3"></i>From {location.city}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <hr />
        </div>
    );
}

export default UserProfile;

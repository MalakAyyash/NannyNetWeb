import { Link, Link as RouterLink } from 'react-router-dom';
import BabysitterData from '../BabysitterData/BabysitterData';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import './Profile.css';



function Profile() {
    const babysitterData = BabysitterData(); // get the data of the babysitter
    const { babysitterKey } = useParams();


    if (babysitterData.hasOwnProperty(babysitterKey)) {
        const selectedBabysitter = babysitterData[babysitterKey];
        // Convert the date string to a JavaScript Date object
        const birthDate = new Date(selectedBabysitter.age);

        // Get the formatted date with month name
        const formattedDate = birthDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        return (
            <>
                <div className=' DetaliedBook mt-5'>
                    <div className=""><p className='pt-2 profileTitle'>Profile</p></div>
                    <p className='profileDate small'>Join date: Nov 7, 2023</p>
                    <hr></hr>
                    <div className='row'>
                        <div className='col-md-8'>
                            <p className='mt-5'>About</p>
                            <p className='about'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi, corrupti consequuntur mollitia cupiditate aperiam, fugiat error nesciunt iste reiciendis aliquid consequatur. Numquam at similique explicabo inventore quis suscipit? Non, officiis.</p>
                        </div>
                        <div className="col-md-4 pt-4 px-5">
                            <div className="BookingForm">
                                <p className=''>Profile Details</p>
                                <div className='mt-4 my-3 py-3 ServiceDeatils'>
                                    <p className='text-dark'>{selectedBabysitter.fname} {selectedBabysitter.lname}</p>
                                    <p className='text-dark'>Date of birth: {formattedDate}</p>
                                    <p className='small'> {selectedBabysitter.type} Babysitter</p>
                                    <p className='small'>{selectedBabysitter.country}/{selectedBabysitter.city}</p>
                                </div>
                                <hr></hr>
                                <div className='mt-2 my-5 py-3 ServiceDeatils'>
                                    <p className='text-dark'>Payment Details</p>
                                    <div className="row pt-3">
                                        <div className="col-md-6"><p className='text-dark'>Total</p></div>
                                        <div className="col-md-6"><p className='text-dark d-flex justify-content-end'>{selectedBabysitter.price}$</p></div>
                                    </div>
                                    <Link to={`/DetailedBook/${babysitterKey}`} >
                                        <button className='mt-3 btn w-100'>Book Now</button>
                                    </Link>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
export default Profile;
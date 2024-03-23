import { Link, Link as RouterLink } from 'react-router-dom';
import BabysitterData from '../BabysitterData/BabysitterData';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'






function EditAccount() {
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
                    <div className=""><p className='pt-2 profileTitle'>Account</p></div>
                    <p className='small'>View and edit your personal info below.</p>
                    <hr></hr>
                    <div>
                        <p className='mt-5'>Dispaly info</p>
                        <p className='small'>This information will be visible to all members of this site.</p>
                        <div className="row">
                        <div className=" col-md-6 form-outline mb-4">
                            <label htmlFor="fname" className="form-label">First Name</label>
                            <input type="text" className="form-control " id="fname" placeholder="" />
                        </div>
                        <div className=" col-md-6 form-outline mb-4">
                            <label htmlFor="lname" className="form-label">Last Name</label>
                            <input type="text" className="form-control " id="lname" placeholder="" />
                        </div>
                        <div className=" col-md-6 form-outline mb-4">
                            <label htmlFor="phone" className="form-label">Phone Number</label>
                            <input type="number" className="form-control " id="phone" placeholder="" />
                        </div>
                        <div className=" col-md-6 form-outline mb-4 pb-5">
                            <label htmlFor="gender" className="form-label"> Gender</label>
                            <select className="form-select" id="gender">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div className='mb-5 col-md-6'>
                            <label htmlFor="age" className="form-label">Date of birth</label>
                            <input type="date" className="form-control " id="age" placeholder="" />
                        </div>

                        <hr></hr>
                        <p className='mt-3'>Location</p>
                        <p className='small'>Update your location</p>
                        <div className=" col-md-6 form-outline mb-4">
                            <label htmlFor="country" className="form-label"> Country</label>
                            <select className="form-select" id="country">
                                <option value="palestine">Palestine</option>
                                <option value="jordan">Jordan</option>
                            </select>
                        </div>
                        <div className=" col-md-6 form-outline mb-4">
                            <label htmlFor="City" className="form-label"> City</label>
                            <select className="form-select" id="country">
                                <option value="ramallah">Ramallah</option>
                                <option value="nablus">Nablus</option>
                                <option value="Salfit">Salfit</option>
                            </select>
                        </div>
                        <div className=" col-md-6 form-outline mb-4">
                            <label htmlFor="area" className="form-label">Area</label>
                            <input type="text" className="form-control " id="area" placeholder="" />
                        </div>
                        <hr></hr>
                        <p className='mt-3'>Account</p>
                        <p className='small'>Update your personal account info</p>
                        <div className=" col-md-6 form-outline mb-4">
                            <label htmlFor="password1" className="form-label">Current Password</label>
                            <input type="password" className="form-control " id="password1" placeholder="" />
                        </div>
                        <div className=" col-md-6 form-outline mb-4">
                            <label htmlFor="password2" className="form-label">New Password</label>
                            <input type="password" className="form-control " id="password2" placeholder="" />
                        </div>
                        <div className=" col-md-6 form-outline mb-4">
                            <label htmlFor="password3" className="form-label">Confirm Password</label>
                            <input type="password" className="form-control " id="password3" placeholder="" />
                        </div>
                        </div>
                        <div className='ServiceDeatils my-5 d-flex justify-content-end'>
                        <button className='border-0 p-2'>Update Info</button>

                        </div>

                    </div>
                </div>
            </>
        )
    }
}
export default EditAccount;
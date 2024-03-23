import React from 'react';
import './Welcome.css';
import { Link as RouterLink } from 'react-router-dom';


function Welcome() {

    return (
        <div className='WelcomeImg d-flex flex-column justify-content-end align-items-start ps-5 pe-5'>
            <h1 className='mb-0 pb-3 '>Welcome to Nanny Net</h1>
            <p className='mt-0 mb-0'>Find the Perfect Babysitter</p>
            <div className='welcome-btn'>
                <hr className='text-dark ps-5' />
                <RouterLink to="/BabysitterRequest" ><button className='border-0 h-50 text-light mb-5 w-100'>Become a Babysitter</button></RouterLink>

            </div>
        </div>
    )
}
export default Welcome;
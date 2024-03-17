import { Link, Link as RouterLink } from 'react-router-dom';
import BabysitterData from '../BabysitterData/BabysitterData';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Bookings.css';

function UpcomingBookings() {

    return (
        <div className='d-flex justify-content-center m-auto m-5'>
            <div className='m-5'>
                <p>You've got nothing booked at the moment.</p>
                <p className=''><RouterLink to="/BookOnline" className="d-flex justify-content-center text-dark small">Check Out Our Services</RouterLink></p>
            </div>
        </div>
    );
}

function HistoryBookings() {
    return (
        <div className='d-flex justify-content-center m-auto m-5'>
            <div className='m-5'>
                <p>We’re looking forward to meeting you.</p>
                <p className=''><RouterLink to="/BookOnline" className="d-flex justify-content-center text-dark small">Check Out Our Services</RouterLink></p>

            </div>
        </div>
    );
}

function Bookings() {
    const babysitterData = BabysitterData();
    const { babysitterKey } = useParams();
    const [activeTab, setActiveTab] = useState('upcoming');
    if (babysitterData.hasOwnProperty(babysitterKey)) {
        const selectedBabysitter = babysitterData[babysitterKey];
        const birthDate = new Date(selectedBabysitter.age);
        const formattedDate = birthDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        return (
            <>
                <div className='DetaliedBook mt-5'>
                    <div className=''>
                        <p className='pt-2 profileTitle'>Manage Your Bookings</p>
                    </div>
                    <p className='small mb-5 '>View, reschedule, or cancel your bookings and easily book again.</p>
                    <ul className="nav nav-tabs mb-5">
                        <li className="nav-item">
                            <a className={`nav-link text-dark px-5 ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')} href="#">
                                Upcoming
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link px-5 text-dark ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')} href="#">
                                History
                            </a>
                        </li>
                    </ul>
                    <div>
                        {activeTab === 'upcoming' && <UpcomingBookings />}
                        {activeTab === 'history' && <HistoryBookings />}
                    </div>
                </div>
            </>
        );
    }
}

export default Bookings;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import HistoryOrders from './HistoryOrders';
import BabysitterStatus from './BabysitterStatus';
import BabysitterFeedback from './BabysitterFeedback';
import BabysitterPayment from './BabysitterPayment';
import BabysitterSchedule from './BabysitterSchedule';

function BabysitterInfoStatus() {
    const [babysitterData, setBabysitterData] = useState(null);
    const [isBabysitterOwner, setIsBabysitterOwner] = useState(false); // State to determine if the viewer is the owner of the profile
    const { id } = useParams(); // Get the ID parameter from the URL
    const [activeTab, setActiveTab] = useState('orders');


    useEffect(() => {
        const fetchBabysitterData = async () => {
            try {
                let response;
                if (isBabysitterOwner) {
                    // Fetch babysitter data using the userId from cookies
                    response = await fetch(`http://176.119.254.188:8080/employee/${Cookies.get('userId')}`);
                } else {
                    // Fetch babysitter data using the id from useParams
                    response = await fetch(`http://176.119.254.188:8080/employee/${id}`);
                }

                if (response.ok) {
                    const data = await response.json();
                    setBabysitterData(data);
                } else {
                    console.error('Failed to fetch babysitter data');
                }
            } catch (error) {
                console.error('Error fetching babysitter data:', error);
            }
        };

        const userId = Cookies.get('userId');
        if (userId) {
            // Check if the user ID in cookies matches the profile user ID
            setIsBabysitterOwner(userId === id);
            fetchBabysitterData();
        }
    }, [id, isBabysitterOwner]);

    if (!babysitterData || !babysitterData.user) {
        return <div>Loading...</div>;
    }

    return (
        <div className='mx-4'>
            <div className=' normalFont'>
                <div className=''>
                    <div className='DetaliedBook'>
                        <p className='pt-2 fst-normal'>{babysitterData.user.name}</p>
                    </div>
                    <p className='small text-secondary fst-normal'>Stay organized and in control of Users info.</p>
                    <hr />
                    <ul className="nav nav-tabs">

                        <li className="nav-item">
                            <a className={`nav-link text-dark px-5 ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')} href="#">
                                Orders
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link text-dark px-5 ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')} href="#">
                                Orders Schedule
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link text-dark px-5 ${activeTab === 'feedback' ? 'active' : ''}`} onClick={() => setActiveTab('feedback')} href="#">
                                Feedback
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link px-5 text-dark ${activeTab === 'payment' ? 'active' : ''}`} onClick={() => setActiveTab('payment')} href="#">
                                Payment
                            </a>
                        </li>
                    </ul>
                    <div>
                        {activeTab === 'orders' && <HistoryOrders />}
                        {activeTab === 'schedule' && <BabysitterSchedule />}
                        {activeTab === 'feedback' && <BabysitterFeedback />}
                        {activeTab === 'payment' && <BabysitterPayment id={id} />}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default BabysitterInfoStatus;

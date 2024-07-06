import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import HistoryOrders from './HistoryOrders';
import CustomerStatus from './CustomerStatus'; // Renamed from BabysitterStatus
import CustomerFeedback from './CustomerFeedback'; // Renamed from BabysitterFeedback
import CustomerPayment from './CustomerPayment';
import CustomerSchedule from './CustomerSchedule';

function CustomerInfoStatus() { // Renamed from BabysitterInfoStatus
    const [customerData, setCustomerData] = useState(null); // Renamed from babysitterData
    const [isCustomerOwner, setIsCustomerOwner] = useState(false); // Renamed from isBabysitterOwner
    const { id } = useParams(); // Get the ID parameter from the URL

    const [activeTab, setActiveTab] = useState('orders');

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                let response;
                if (isCustomerOwner) {
                    // Fetch customer data using the userId from cookies
                    response = await fetch(`http://176.119.254.188:8080/customer/${Cookies.get('userId')}`);
                } else {
                    // Fetch customer data using the id from useParams
                    response = await fetch(`http://176.119.254.188:8080/customer/${id}`);
                }

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

        const userId = Cookies.get('userId');
        if (userId) {
            // Check if the user ID in cookies matches the profile user ID
            setIsCustomerOwner(userId === id);
            fetchCustomerData();
        }
    }, [id, isCustomerOwner]);

    if (!customerData || !customerData.user) {
        return <div>Loading...</div>;
    }

    return (
        <div className='mx-4'>
            <div className=' normalFont'>
                <div className=''>
                    <div className='DetaliedBook'>
                        <p className='pt-2 fst-normal'>{customerData.user.name}</p>
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
                            <a className={`nav-link px-5 text-dark ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')} href="#">
                                Order Schedule
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
                        {activeTab === 'schedule' && <CustomerSchedule />}
                        {activeTab === 'feedback' && <CustomerFeedback  />}
                        {activeTab === 'payment' && <CustomerPayment id={id}  />}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomerInfoStatus;

import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import HistoryOrders from './HistoryOrders';
import CustomerStatus from './CustomerStatus';
import CustomerCount from './CustomerFeedback';
import CustomerFeedback from './CustomerFeedback';




function CustomerInfoStatus() {
    const [customerData, setCustomerData] = useState(null);
    const [ownerProfile, setOwnerProfile] = useState(false); // State to determine if the viewer is the owner of the profile
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const { id } = useParams(); // Get the ID parameter from the URL


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                let response;
                if (ownerProfile) {
                    // Fetch user data using the userId from cookies
                    response = await fetch(`http://176.119.254.188:8080/customer/${Cookies.get('userId')}`);
                } else {
                    // Fetch employee data using the id from useParams
                    response = await fetch(`http://176.119.254.188:8080/customer/${id}`);
                }

                if (response.ok) {
                    const data = await response.json();
                    setCustomerData(data);
                } else {
                    console.error('Failed to fetch user data');
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
    }, [id, ownerProfile]);


    if (!customerData || !customerData.user) {
        return <div>Loading...</div>;
    }

    return (
        <div className='mx-4'>
            <div className='DetaliedBooknormalFont'>
                <div className='DetaliedBook'>
                    <div className=''>
                        <p className='pt-2 profileTitle'>View {customerData.user.name} Bookings</p>
                    </div>
                    <p className='small'>Stay in control of the customer scheduled.</p>
                    <div className="row">
                        <div className="col-md-6">
                            <div>
                                <HistoryOrders />
                            </div>
                        </div>
                        <div className="col-md-6">
                                <CustomerStatus />
                                <CustomerFeedback />

                              

                        </div>
                    </div>


                </div>
                <hr />
            </div>
        </div>
    );
}

export default CustomerInfoStatus;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import HistoryOrders from './HistoryOrders';
import BabysitterStatus from './BabysitterStatus';
import BabysitterFeedback from './BabysitterFeedback';

function BabysitterInfoStatus() {
    const [babysitterData, setBabysitterData] = useState(null);
    const [isBabysitterOwner, setIsBabysitterOwner] = useState(false); // State to determine if the viewer is the owner of the profile
    const { id } = useParams(); // Get the ID parameter from the URL

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
            <div className='DetaliedBooknormalFont'>
                <div className='DetaliedBook'>
                    <div className=''>
                        <p className='pt-2 profileTitle'>View {babysitterData.user.name} Orders</p>
                    </div>
                    <p className='small'>Stay in control of the babysitter scheduled.</p>
                    <div className="row">
                        <div className="col-md-6">
                            <div>
                                <HistoryOrders />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <BabysitterStatus />
                            <BabysitterFeedback/>
                        </div>
                    </div>
                </div>
                <hr />
            </div>
        </div>
    );
}

export default BabysitterInfoStatus;

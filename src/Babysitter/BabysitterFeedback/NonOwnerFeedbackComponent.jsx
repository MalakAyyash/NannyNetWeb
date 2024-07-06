import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

function NonOwnerFeedbackComponent({ id }) {
    const [feedbackData, setFeedbackData] = useState(null); // State to store feedback data

    useEffect(() => {
        const fetchFeedbackData = async () => {
            try {
                const token = Cookies.get('jwt');
                if (!token) {
                    console.error('Token not found.');
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const requestBody = {
                    employeeId: id
                };

                const response = await axios.post('http://176.119.254.188:8080/customer/feedback/search/employee', requestBody, config);

                if (response && response.data) {
                    console.log(response.data);
                    setFeedbackData(response.data);
                } else {
                    console.log('No data returned from API');
                    setFeedbackData([]); // Set empty array to show no feedback available
                }
            } catch (error) {
                console.error('Error fetching feedback data:', error);
            }
        };

        fetchFeedbackData();
    }, [id]);

    if (!feedbackData) {
        return <div>Loading...</div>;
    }

    // Function to render star rating
    const renderStarRating = (stars) => {
        const starElements = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= stars) {
                // Render a filled star
                starElements.push(<i key={i} className="fa-solid fa-star text-warning"></i>);
            } else {
                // Render an empty star
                starElements.push(<i key={i} className="fa-regular fa-star text-secondary"></i>);
            }
        }
        return starElements;
    };

    return (
        <div className=''>
            <div className='DetailedBook mt-5 mb-5 pb-5'>
                {feedbackData.length === 0 ? (
                    <div className="text-center mb-3 mt-5">
                        <p className='mt-5'>No feedback available at the moment</p>
                        <div className=''>
                            <Link to={`/BabysittersList`} className='text-decoration-none'>
                                <p className='mb-5 redText'>Check Out Our Services</p>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Customer Name</th>
                                <th>Customer City/Street</th>
                                <th>Feedback Date</th>
                                <th>Stars</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedbackData.map((feedback, index) => (
                                <tr key={index}>
                                    <td>
                                        <Link className='textRedColor' to={`/user-profile/${feedback.customer.user.id}`}>
                                            {feedback.customer.user.name}
                                        </Link>
                                    </td>
                                    <td>{`${feedback.customer.location.city}/${feedback.customer.location.streetData}`}</td>
                                    <td>{new Date(feedback.feedbackSubmittedDate).toLocaleDateString()}</td>
                                    <td>
                                        {renderStarRating(feedback.stars)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default NonOwnerFeedbackComponent;

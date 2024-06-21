import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import './Feedback.css';
import { Rating } from 'react-simple-star-rating';

function LeaveFeedback() {
    const [customerOrders, setCustomerOrders] = useState(null);
    const [ratingValue, setRatingValue] = useState(0); // State to store the selected rating
    const [feedbackMessage, setFeedbackMessage] = useState(''); // State to store the feedback message
    const [modalOpen, setModalOpen] = useState(false); // State to control the modal visibility
    const [orderId, setOrderId] = useState(null); // State to store the current order ID

    useEffect(() => {
        const fetchCustomerOrders = async () => {
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

                const response = await axios.get('http://176.119.254.188:8080/customer/orders/outgoing', config);

                if (response && response.data) {
                    setCustomerOrders(response.data);
                } else {
                    console.log('No data returned from API');
                    setCustomerOrders([]); // Set empty array to show no orders
                }
            } catch (error) {
                console.error('Error fetching customer orders:', error);
            }
        };
        fetchCustomerOrders();
    }, []);

    if (!customerOrders) {
        return <div>Loading...</div>;
    }

    // Function to handle rating change
    const handleRating = (rate) => {
        setRatingValue(rate);
    };

    // Function to handle feedback message change
    const handleFeedbackMessageChange = (event) => {
        setFeedbackMessage(event.target.value);
    };

    // Function to handle saving changes
    const handleSaveChanges = async (employeeId, orderId) => {
        try {
            // Create the request body
            const requestBody = {
                employeeId: employeeId,
                stars: ratingValue,
                comment: feedbackMessage
            };
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

            const response = await axios.post('http://176.119.254.188:8080/customer/feedback/submit', requestBody, config);

            if (response.status === 200) {
                console.log('Feedback submitted successfully:', response.data);
                window.alert('Feedback submitted successfully');
                // Close the modal
                document.querySelector(`#exampleModal${orderId} .btn-close`).click();
            } else {
                console.error('Failed to submit feedback:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    return (
        <div className=''>
            <div className='DetaliedBook mt-5 mb-5 pb-5'>
                {customerOrders.length === 0 ? (
                    <div className="text-center mb-3 mt-5">
                        <p className='mt-5'>You have no orders to submit feedback at the moment</p>
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
                                <th>Babysitter Name</th>
                                <th>Price</th>
                                <th>Type of Babysitter</th>
                                <th>City/Street</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customerOrders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.employee.user.name}</td>
                                    <td>{order.price}</td>
                                    <td>{order.employee.type}</td>
                                    <td>{`${order.orderLocation.city}/${order.orderLocation.streetData}`}</td>
                                    <td>{order.startTime}</td>
                                    <td>{order.endTime}</td>
                                    <td>
                                        <button type="button" className="BlueColor rounded-0 text-light border-0 p-2" data-bs-toggle="modal" data-bs-target={`#exampleModal${order.id}`} onClick={() => { setModalOpen(true); setOrderId(order.id); }}>
                                            Leave Feedback
                                        </button>
                                        <div>
                                            <div className="modal fade " id={`exampleModal${order.id}`} tabIndex={-1} aria-labelledby={`exampleModalLabel${order.id}`} aria-hidden="true">
                                                <div className="modal-dialog ">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h5 className="modal-title text-center" id={`exampleModalLabel${order.id}`}>Add Your Feedback</h5>
                                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                                        </div>
                                                        <div className="modal-body text-center">
                                                        <div className=''>

                                                            <p className=''> We are always looking for ways to improve your experience. Please take a moment to evaluate and tell us what you think. </p>
                                                            </div>
                                                            <div className='d-flex justify-content-center'>
                                                                <Rating onClick={handleRating} ratingValue={ratingValue} />
                                                            </div>
                                                            <textarea rows="4" className='my-4 w-100' placeholder='Add Your Feedback' value={feedbackMessage} onChange={handleFeedbackMessageChange} />
                                                        </div>
                                                        <div className="modal-footer">
                                                        <button type="button" class="btn  text-danger rounded-0 me-3" data-bs-dismiss="modal">Cancel</button>

                                                            <button type="button" className="btn redColor text-light rounded-0 ps-5" onClick={() => handleSaveChanges(order.employee.user.id, order.id)}>Save changes</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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

export default LeaveFeedback;

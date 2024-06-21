import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function AllNotifications() {
    const [notifications, setNotifications] = useState([]);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    useEffect(() => {
        const fetchNotifications = async () => {
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
                const response = await axios.get('http://176.119.254.188:8080/user/notifications/unread', config);
                if (response.status === 200) {
                    setNotifications(response.data);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', options);
        }
    };

    return (
        <div className="all-notifications">
            {notifications.length === 0 ? (
                <div className="notification-item">No Notifications</div>
            ) : (
                notifications.slice().reverse().map((notification, index) => (
                    <div key={index} className="notification-item row">
                        <div className="notification-body">
                            <div className="row">
                                <div className="notification-image-container col-md-2">
                                    <img src="/images/UserProfile.jpg" alt="User Profile" className="notification-profile-image" />
                                </div>
                                <div className="col-md-8">
                                    <p className="notification-message pt-3">{notification.message}</p>
                                    <p className="notification-date small">
                                        {formatDate(notification.notificationDate)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default AllNotifications;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function UnreadNotifications() {
    const [notifications, setNotifications] = useState([]);

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

    return (
        <div className="all-notifications container">
            {notifications.length === 0 ? (
                <div className="notification-item alert alert-info">No Unread Notifications</div>
            ) : (
                notifications.map((notification, index) => (
                    <div key={index} className="notification-item card mb-3">
                        <div className="card-body row">
                            <div className="notification-image-container col-md-2">
                                <img src="/images/UserProfile.jpg" alt="User Profile" className="notification-profile-image img-fluid rounded-circle" />
                            </div>
                            <div className="col-md-10">
                                <p className="notification-message pt-3">{notification.message}</p>
                                <p className="notification-date text-muted">{new Date(notification.notification_date).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default UnreadNotifications;

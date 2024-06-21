import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Notification.css'; // Ensure you create this CSS file to style the notifications
import moment from 'moment';
import { Link as RouterLink } from 'react-router-dom';

function Notification() {
    const [notifications, setNotifications] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userId, setUserId] = useState(0);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = Cookies.get('jwt');
                const userId = Cookies.get('userId');
                setUserId(userId);

                if (!token) {
                    console.error('Token not found.');
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get('http://176.119.254.188:8080/user/notifications/all', config);
                if (response.status === 200) {
                    const sortedNotifications = response.data.sort((a, b) => new Date(b.notificationDate) - new Date(a.notificationDate));
                    setNotifications(sortedNotifications);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const formatNotificationDate = (notificationDate) => {
        const today = moment().startOf('day');
        const yesterday = moment().subtract(1, 'days').startOf('day');
        const notificationMoment = moment(notificationDate);

        if (notificationMoment.isSame(today, 'd')) {
            return 'Today';
        } else if (notificationMoment.isSame(yesterday, 'd')) {
            return 'Yesterday';
        } else {
            return notificationMoment.format('MMM DD, YYYY');
        }
    };

    const markNotificationAsRead = async (notificationId) => {
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

            // Call the API to mark notification as read
            await axios.get(`http://176.119.254.188:8080/user/notification/read/${notificationId}`);

            // Update the local state to mark the notification as read
            const updatedNotifications = notifications.map(notification =>
                notification.id === notificationId ? { ...notification, read: true } : notification
            );
            setNotifications(updatedNotifications);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Filter out unread notifications
    const unreadNotifications = notifications.filter(notification => !notification.read);

    return (
        <div className="notification-container">
            <div className="notification-icon" onClick={toggleDropdown}>
                <i className="fa-solid fa-bell"></i>
                {unreadNotifications.length > 0 && <span className="notification-count">{unreadNotifications.length}</span>}
            </div>
            {isDropdownOpen && (
                <div className="notification-dropdown p-3">
                    <div className="notification-header row">
                        <div className='col-md-8'>
                            <h3 className='text-dark pb-2 profileTitle'>Notifications</h3>
                        </div>
                        <div className="notification-options small d-flex justify-content-end pt-2 col-md-4">
                            <RouterLink to={`/BabysitterNotification/${userId}`} className="nav-link active notification-option">All</RouterLink>
                        </div>
                    </div>
                    {notifications.length === 0 ? (
                        <div className="dropdown-item d-flex justify-content-center py-3 text-dark small">No Notifications</div>
                    ) : (
                        notifications.map((notification, index) => (
                            <div key={index} className="dropdown-item notification-item" onClick={() => markNotificationAsRead(notification.id)}>
                                <div className="notification-body text-secondary">
                                    <div className='row'>
                                        <div className="notification-image-container col-md-4">
                                            <img src="/images/UserProfile.jpg" alt="User Profile" className="notification-profile-image" />
                                            <p className="notification-date textRedColor mb-0 mt-3 ps-2">{formatNotificationDate(notification.notificationDate)}</p>
                                        </div>
                                        <div className='col-md-8 d-flex justify-content-between align-items-center'>
                                            <span className="notification-message-container">
                                                <p className="notification-message small pt-2 mb-0">{notification.message}</p>
                                                {!notification.read && <span className="unread-indicator"></span>}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default Notification;

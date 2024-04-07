import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Profile from '../Profile/Profile';
import EditAccount from '../EditAccount/EditAccount';
import Bookings from '../Bookings/Bookings';
import UserProfile from '../UserProfile/UserProfile';
import './UserAccount.css';
import UserEditAccount from '../UserEditAccount/UserEditAccount';


function UserAccount() {

    const [customerData, setCustomerData] = useState(null);
    const [selectedNavItem, setSelectedNavItem] = useState('profile');
    const [count, setCount] = useState(false);

    const handleClick = num => {
        setCount(num);
        if (num) {
            setSelectedNavItem('account');
        }
    };


    const handleNavItemClick = (item) => {
        setSelectedNavItem(item);
        if (item === 'profile' || item === 'bookings') {
            setCount(false);
        }
    };

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const response = await fetch(`http://176.119.254.188:8080/customer/${Cookies.get('userId')}`);
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

        if (Cookies.get('userId')) {
            fetchCustomerData();
        }
    }, [count]);

    return (
        <>
            {customerData ? (
                <div className='Book-container-fluid '>
                    <div className='Service pt-5 mt-5 mb-3'>
                        <div className='Cover d-flex align-items-center justify-content-start ps-3 '>
                            <div className='photo-container mt-5 me-3 position-relative' style={{ width: '150px', height: '150px', overflow: 'hidden', borderRadius: '50%', zIndex: '1' }}>
                                <img src="/images/UserProfile.jpg" className="card-img-top" alt="Profile" />
                            </div>
                            <h2 className='text-light pt-5 mt-5'>{customerData.user.username}</h2>
                        </div>
                    </div>
                    <ul className="nav">
                        <li className={`nav-item ${selectedNavItem === 'profile' ? 'active' : ''}`}>
                            <button className={`nav-link ${selectedNavItem === 'profile' ? 'border-bottom' : 'text-dark'}`} onClick={() => handleNavItemClick('profile')}>Profile</button>
                        </li>
                        <li className={`nav-item ${selectedNavItem === 'bookings' ? 'active' : ''}`}>
                            <button className={`nav-link ${selectedNavItem === 'bookings' ? 'border-bottom' : 'text-dark'}`} onClick={() => handleNavItemClick('bookings')}>My Bookings</button>
                        </li>
                        <li className={`nav-item ${selectedNavItem === 'wallet' ? 'active' : ''}`}>
                            <button className={`nav-link ${selectedNavItem === 'wallet' ? 'border-bottom' : 'text-dark'}`} onClick={() => handleNavItemClick('wallet')}>My Wallet</button>
                        </li>
                        <li className={`nav-item ${selectedNavItem === 'account' && count ? 'active' : ''}`}>
                            <button className={`nav-link ${selectedNavItem === 'account' || count ? 'border-bottom' : 'text-dark'}`} onClick={() => handleNavItemClick('account')}>My Account</button>
                        </li>
                    </ul>
                    { count == false && selectedNavItem === 'profile' && (
                        <div>
                            <UserProfile
                                name={customerData.user.name}
                                username={customerData.user.username}
                                email={customerData.user.email}
                                telNumber={customerData.user.telNumber}
                                describtion={customerData.user.describtion}
                                gender={customerData.user.gender}
                                role={customerData.user.role}
                                dateAdded={customerData.user.dateAdded}
                                locations={customerData.locations}

                            
                                handleClick={handleClick}
                            />
                        </div>
                    )}
                    {selectedNavItem === 'bookings' && (
                        <div>
                            <Bookings />
                        </div>
                    )}
                    {selectedNavItem === 'wallet' && (
                        <div>
                            {/* Render Wallet component here */}
                        </div>
                    )}
                    {(count || selectedNavItem === 'account') && (
                        <div>
                            <UserEditAccount
                                name={customerData.user.name}
                                username={customerData.user.username}
                                email={customerData.user.email}
                                telNumber={customerData.user.telNumber}
                                describtion={customerData.user.describtion}
                                gender={customerData.user.gender}
                                role={customerData.user.role}
                                locations={customerData.locations}

                            />
                        </div>
                    )}
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </>
    );
}
export default UserAccount;

import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link as RouterLink } from 'react-router-dom';
import Swal from 'sweetalert2';


function BabysitterEditAccount() {
    const [customerData, setCustomerData] = useState(null);

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const response = await fetch(`http://176.119.254.188:8080/employee/${Cookies.get('userId')}`);
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
    }, []);

const handleSubmit = async (values, actions) => {
    try {
        const token = Cookies.get('jwt');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await axios.post('http://176.119.254.188:8080/provider/edit', values, config);

        console.log('Server response:', response.data);

        actions.setSubmitting(false);

        if (response.status === 200) {
            // Show success message
            Swal.fire({
                title: 'Great!',
                text: 'Updated successfully!',
                icon: 'success',
                didOpen: () => {
                    const confirmButton = Swal.getConfirmButton();
                    confirmButton.style.backgroundColor = 'rgb(194, 39, 75)';
                    confirmButton.style.color = 'white';
                },
            });
        } else {
            // Handle unsuccessful response
            console.error('Error updating profile:', response.data.error);
        }
    } catch (error) {
        // Handle network errors or unexpected errors
        console.error('Error:', error);

        // Log specific error response if available
        if (error.response) {
            console.error('Error Response:', error.response.data);
        }

        alert('An error occurred while updating profile.');
        actions.setSubmitting(false);
    }
};


    const profileValidationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        telNumber: Yup.string().required('Phone Number is required'),
        city: Yup.string().required('City is required'),
        accountNumber: Yup.string().required('accountNumber is required'),

    });

    const passwordValidationSchema = Yup.object().shape({
        currentPassword: Yup.string().required('Current Password is required'),
        newPassword: Yup.string().required('New Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
            .required('Confirm Password is required'),
    });

    const profileFormik = useFormik({
        initialValues: {
            name: customerData?.user?.name || '',
            username: customerData?.user?.username || '',
            email: customerData?.user?.email || '',
            telNumber: customerData?.user?.telNumber || '',
            describtion: customerData?.user?.describtion || '',
            city: customerData?.city || '',
            gender: customerData?.user?.gender || '',
            accountNumber: customerData?.accountNumber || '',
            currentPassword:  '',
            newPassword:  '',
            confirmPassword: '',
        },
        validationSchema: profileValidationSchema,
        onSubmit: handleSubmit,
    });

    useEffect(() => {
        // Update form values when customerData changes
        if (customerData) {
            profileFormik.setValues({
                name: customerData?.user?.name || '',
                username: customerData?.user?.username || '',
                email: customerData?.user?.email || '',
                telNumber: customerData?.user?.telNumber || '',
                describtion: customerData?.user?.describtion || '',
                city: customerData?.city || '',  // Ensure correct path to city
                gender: customerData?.user?.gender || '',
                accountNumber: customerData?.user?.accountNumber || '',
                currentPassword:  '',
                newPassword:  '',
                confirmPassword:  '',
            });
        }
    }, [customerData]); // Re-run when customerData changes

    useEffect(() => {
        // console.log(customerData.user.gender)
        if (customerData) {
            passwordFormik.setValues({
                name: customerData?.user?.name || '',
                username: customerData?.user?.username || '',
                email: customerData?.user?.email || '',
                telNumber: customerData?.user?.telNumber || '',
                describtion: customerData?.user?.describtion || '',
                gender: customerData?.user?.gender || '',
                city: customerData?.city || '',
                accountNumber: customerData?.user?.accountNumber || '',
                currentPassword:  '',
                newPassword: '',
                confirmPassword:  '',
            });
        }
    }, [customerData]);
    
    const passwordFormik = useFormik({
        initialValues: {
            name: customerData?.user?.name || '',
            username: customerData?.user?.username || '',
            email: customerData?.user?.email || '',
            telNumber: customerData?.user?.telNumber || '',
            describtion: customerData?.user?.describtion || '',
            city: customerData?.city || '', 
            gender: customerData?.user?.gender || '',
            accountNumber: customerData?.user?.accountNumber || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: passwordValidationSchema,
        onSubmit: handleSubmit,
    });


    if (!customerData) {
        return <div>Loading...</div>;
    }
    return (
        <div className='Book-container-fluid'>
        <div className='Service pt-5 mt-5 mb-3'>
            <div className='Cover d-flex align-items-center justify-content-start ps-3'>
                <div className='photo-container mt-5 me-3 position-relative' style={{ width: '150px', height: '150px', overflow: 'hidden', borderRadius: '50%', zIndex: '1' }}>
                    <img src="/images/UserProfile.jpg" className="card-img-top" alt="Profile" />
                </div>
                <h2 className='text-light pt-5 mt-5'>{customerData.user.username}</h2>
            </div>
        </div>
        <ul className="nav">
            <li className={`nav-item `}>
            <RouterLink to={`/babysitter-profile/${customerData.user.id}`} className={`nav-link`}>Profile</RouterLink>
            </li>
            <li className={`nav-item`}>
            <RouterLink to={`/BabysitterBookings/${customerData.user.id}`} className={`nav-link `}>My Orders</RouterLink>
            </li>
            <li className={`nav-item`}>
                <button className={`nav-link `} >My Wallet</button>
            </li>
            <li className={`nav-item`}>
                <RouterLink to="/BabysitterEditAccount" className={`nav-link border-bottom `}>Account</RouterLink>
            </li>
        </ul>
       
        <div className='DetaliedBook mt-5'>
            <div className=''>
                <p className='pt-2 profileTitle'>Account</p>
            </div>
            <p className='small'>View and edit your personal info below.</p>
            <hr />

            <div>
                <p className='mt-5'>Display Info</p>
                <p className='small'>This information will be visible to all members of this site.</p>

                <form onSubmit={profileFormik.handleSubmit}>
                    <div className='row'>
                        <div className='col-md-6 form-outline mb-4'>
                            <label htmlFor='name' className='form-label'>
                                Name
                            </label>
                            <input
                                type='text'
                                className='form-control'
                                id='name'
                                placeholder=''
                                value={profileFormik.values.name}
                                onChange={profileFormik.handleChange}
                            />
                            {profileFormik.touched.name && profileFormik.errors.name ? (
                                <div className='text-danger'>{profileFormik.errors.name}</div>
                            ) : null}
                        </div>
                        <div className='col-md-6 form-outline mb-4'>
                            <label htmlFor='telNumber' className='form-label'>
                                Phone Number
                            </label>
                            <input
                                type='text'
                                className='form-control'
                                id='telNumber'
                                placeholder=''
                                value={profileFormik.values.telNumber}
                                onChange={profileFormik.handleChange}
                            />
                            {profileFormik.touched.telNumber && profileFormik.errors.telNumber ? (
                                <div className='text-danger'>{profileFormik.errors.telNumber}</div>
                            ) : null}
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-6 form-outline mb-4'>
                            <label htmlFor='City' className='form-label'>
                                City
                            </label>
                            <select
                                className='form-select'
                                id='city'
                                value={profileFormik.values.city}
                                onChange={profileFormik.handleChange}
                            >
                                <option value='ramallah'>Ramallah</option>
                                <option value='nablus'>Nablus</option>
                                <option value='Salfit'>Salfit</option>
                                <option value='Bethlehem'>Bethlehem</option>
                                <option value='Hebron'>Hebron</option>
                                <option value='Jenen'>Jenen</option>
                                <option value='Tulkarm'>Tulkarm</option>
                                <option value='BeitSahour'>BeitSahour</option>
                                <option value='Qalqilya'>Qalqilya</option>

                            </select>
                            {profileFormik.touched.city && profileFormik.errors.city ? (
                                <div className='text-danger'>{profileFormik.errors.city}</div>
                            ) : null}
                        </div>
                        <div className='col-md-6 form-outline mb-4'>
                            <label htmlFor='accountNumber' className='form-label'>
                            Account Number
                            </label>
                            <input
                                type='text'
                                className='form-control'
                                id='accountNumber'
                                placeholder=''
                                value={profileFormik.values.accountNumber}
                                onChange={profileFormik.handleChange}
                            />
                            {profileFormik.touched.accountNumber && profileFormik.errors.accountNumber ? (
                                <div className='text-danger'>{profileFormik.errors.accountNumber}</div>
                            ) : null}
                        </div>
                        <div className='col-md-6 form-outline mb-4'>
                            <label htmlFor='describtion' className='form-label'>
                                About
                            </label>
                            <textarea
                                type='text'
                                className='form-control'
                                id='describtion'
                                placeholder=''
                                value={profileFormik.values.describtion}
                                onChange={profileFormik.handleChange}
                            />
                            {profileFormik.touched.describtion && profileFormik.errors.describtion ? (
                                <div className='text-danger'>{profileFormik.errors.describtion}</div>
                            ) : null}
                        </div>
                    </div>
                                    {/* Submit Button */}
                <button type='submit' className ="redColor border-0 text-light normalFont p-2 d-flex ms-auto" disabled={profileFormik.isSubmitting}>
                    Update Profile
                </button>
            </form>

                    <hr />

                    <p className='mt-5'>Change Password</p>
                    <p className='small pb-4'>Enter your current and new passwords below.</p>
            <form onSubmit={passwordFormik.handleSubmit}>

                    <div className='row'>
                        <div className='col-md-6 form-outline mb-4'>
                            <label htmlFor='currentPassword' className='form-label'>
                                Current Password
                            </label>
                            <input
                                type='password'
                                className='form-control'
                                id='currentPassword'
                                placeholder=''
                                value={passwordFormik.values.currentPassword}
                                onChange={passwordFormik.handleChange} />
                                {passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword ? (
                                    <div className='text-danger'>{passwordFormik.errors.currentPassword}</div>
                                ) : null}
                           
                        </div>
                        <div className='col-md-6 form-outline mb-4'>
                            <label htmlFor='newPassword' className='form-label'>
                                New Password
                            </label>
                            <input
                                type='password'
                                className='form-control'
                                id='newPassword'
                                placeholder=''
                                value={passwordFormik.values.newPassword}
                                onChange={passwordFormik.handleChange}
                            />
                             {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword ? (
                                    <div className='text-danger'>{passwordFormik.errors.newPassword}</div>
                                ) : null}
                        </div>
                        <div className='col-md-6 form-outline mb-4'>
                            <label htmlFor='confirmPassword' className='form-label'>
                                Confirm Password
                            </label>
                            <input
                                type='password'
                                className='form-control'
                                id='confirmPassword'
                                placeholder=''
                                value={passwordFormik.values.confirmPassword}
                                onChange={passwordFormik.handleChange}
                            />
                              {passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword ? (
                                    <div className='text-danger'>{passwordFormik.errors.confirmPassword}</div>
                                ) : null}
                        </div>
                    </div>

                    {/* Submit Button */}
                <button type='submit' className ="redColor border-0 text-light normalFont p-2 d-flex ms-auto mb-5" disabled={passwordFormik.isSubmitting}>
                    Change Password
                </button>
            </form>
            </div>
        </div>
        </div>
    );
}

export default BabysitterEditAccount;
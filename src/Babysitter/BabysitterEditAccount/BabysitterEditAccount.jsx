import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link as RouterLink } from 'react-router-dom';
import Swal from 'sweetalert2';

function BabysitterEditAccount() {
    const [customerData, setCustomerData] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const token = Cookies.get('jwt');

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                if (!token) {
                    console.error('Token not found.');
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const response = await fetch(`http://176.119.254.188:8080/employee/${Cookies.get('userId')}`);
                if (response.ok) {
                    const data = await response.json();
                    setCustomerData(data);
                } else {
                    console.error('Failed to fetch customer data');
                }

                const responseImage = await fetch(`http://176.119.254.188:8080/user`, config);
                if (responseImage.ok) {
                    const imageData = await responseImage.blob();
                    const imageUrl = URL.createObjectURL(imageData);
                    setProfileImageUrl(imageUrl);
                } else {
                    console.error('Failed to fetch profile image');
                }

            } catch (error) {
                console.error('Error fetching customer data:', error);
            }
        };

        if (Cookies.get('userId')) {
            fetchCustomerData();
        }
    }, [token]);

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
                console.error('Error updating profile:', response.data);
            }
        } catch (error) {
            console.error('Error:', error);

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
        accountNumber: Yup.string().required('Account Number is required'),
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
        enableReinitialize: true, // Enable reinitialization
    });

    useEffect(() => {
        if (customerData) {
            profileFormik.setValues({
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
            });
        }
    }, [customerData]); // Re-run when customerData changes


    const passwordFormik = useFormik({
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
        validationSchema: passwordValidationSchema,
        onSubmit: handleSubmit,
    });

    useEffect(() => {
        if (customerData) {
            passwordFormik.setValues({
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
            });
        }
    }, [customerData]); // Re-run when customerData changes


    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('http://176.119.254.188:8080/upload/profile/image', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const updatedImageUrl = await response.text();
                setProfileImageUrl(updatedImageUrl);
            } else {
                console.error('Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    if (!customerData) {
        return <div>Loading...</div>;
    }
    return (
        <div className='Book-container-fluid'>
         <div className='Service pt-5 mt-5 mb-3'>
        <div className='Cover d-flex align-items-center justify-content-start ps-3'>
          <div className='position-relative'>
            <div className='photo-container mt-5 me-3 position-relative'>
                <label htmlFor="image-upload">
                  <i className="fa-solid fa-camera position-absolute bottom-0 start-0 translate-middle mb-1 ms-3 text-dark rounded p-1"
                     style={{ fontSize: '24px' }}
                     data-bs-toggle="tooltip"
                     data-bs-placement="top"
                     title="Change Your Image"
                  ></i>
                </label>
              <div className="rounded-circle rounded-circle-container overflow-hidden">
                <img src={profileImageUrl || "/images/UserProfile.jpg"} className="card-img-top" alt="Profile" />
              </div>
              <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="input-file" />
            </div>
          </div>

          <div>
            <h2 className='text-light'>{customerData.user.username}</h2>
            <i className="fa-solid fa-user-tie text-secondary small fs-6">Babysitter</i>
            </div>
        </div>
      </div>
        <ul className="nav d-none d-md-flex">
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
                <RouterLink to={`/BabysitterFeedback/${customerData.user.id}`} className={`nav-link`}>Feedback</RouterLink>
                </li>
            <li className={`nav-item`}>
                <RouterLink to="/BabysitterEditAccount" className={`nav-link border-bottom `}>Account</RouterLink>
            </li>
            <li className={`nav-item`}>
                <RouterLink to={`/BabysitterNotification/${customerData.user.id}`} className={`nav-link`}>Notification</RouterLink>
                </li>
        </ul>
        <div className="d-md-none">
        <div>
          <hr />
          <div className="btn-group w-100">
            Account
            <button type="button" className="btn btn-secondary dropdown-toggle border-0 dropdown-toggle-split d-flex justify-content-end px-0" data-bs-toggle="dropdown" aria-expanded="false">
              <span className="visually-hidden">Toggle Dropdown</span>
            </button>
            <ul className="dropdown-menu w-100">
              <div id="mobile-nav" className="mt-2">
                <RouterLink to={`/babysitter-profile/${customerData.user.id}`} className={`nav-link border-bottom`}>Profile</RouterLink>
                <RouterLink to={`/BabysitterBookings/${customerData.user.id}`} className={`nav-link d-block mb-2`}>My Bookings</RouterLink>
                <RouterLink to={`/BabysitterFeedback/${customerData.user.id}`} className={`nav-link d-block mb-2`}>Feedback</RouterLink>
                <RouterLink to={`/BabysitterNotification/${customerData.user.id}`} className={`nav-link d-block mb-2`}>Notification</RouterLink>
                <button className={`nav-link d-block mb-2`}>My Wallet</button>
              </div>
            </ul>
          </div>
        </div>

      </div>
      <hr />
       
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
                                <option value='Salfeet'>Salfeet</option>
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
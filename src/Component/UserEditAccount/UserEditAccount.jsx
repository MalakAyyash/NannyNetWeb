import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

function UserEditAccount({ name, username, email, telNumber, describtion, gender, role, locations }) {

    const initialValues = {
        name: name || '',
        username: username || '',
        email: email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        telNumber: telNumber || '',
        describtion: describtion || '',
        gender: gender || '',
        city: locations[0].city || '',
        streetData: locations[0].streetData || '',
        extraDescription: locations[0].extraDescription || '',
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        telNumber: Yup.string().required('Phone Number is required'),
        city: Yup.string().required('City is required'),
        streetData: Yup.string().required('Street data is required'),
    });

    const onSubmit = async (values) => {
        try {
            const { city, streetData, extraDescription, ...otherValues } = values;
            const locations = [{ city, streetData, extraDescription }];
            const dataToSend = { ...otherValues, locations };
            console.log('Data to send:', dataToSend);
    
            const response = await axios.post('http://176.119.254.188:8080/customer/edit', dataToSend);
            console.log('Server response:', response.data);
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                console.error('Server responded with status:', error.response.status);
                console.error('Server error message:', error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received from server');
            } else {
                // Something else happened while setting up the request
                console.error('Error:', error.message);
            }
        }
    };
    
        
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });

    return (
        <div className='DetaliedBook mt-5'>
            <div className=''>
                <p className='pt-2 profileTitle'>Account</p>
            </div>
            <p className='small'>View and edit your personal info below.</p>
            <hr />

            <div>
                <p className='mt-5'>Display Info</p>
                <p className='small'>This information will be visible to all members of this site.</p>

                <form onSubmit={formik.handleSubmit}>
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
                                value={formik.values.name}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.name && formik.errors.name ? (
                                <div className='text-danger'>{formik.errors.name}</div>
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
                                value={formik.values.telNumber}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.telNumber && formik.errors.telNumber ? (
                                <div className='text-danger'>{formik.errors.telNumber}</div>
                            ) : null}
                        </div>
                    </div>

                    <hr />

                    <div className='row'>
                        <div className='col-md-6 form-outline mb-4'>
                            <label htmlFor='City' className='form-label'>
                                City
                            </label>
                            <select
                                className='form-select'
                                id='city'
                                value={formik.values.city}
                                onChange={formik.handleChange}
                            >
                                <option value='ramallah'>Ramallah</option>
                                <option value='nablus'>Nablus</option>
                                <option value='Salfit'>Salfit</option>
                            </select>
                            {formik.touched.city && formik.errors.city ? (
                                <div className='text-danger'>{formik.errors.city}</div>
                            ) : null}
                        </div>
                        <div className='col-md-6 form-outline mb-4'>
                            <label htmlFor='streetData' className='form-label'>
                                Area
                            </label>
                            <input
                                type='text'
                                className='form-control'
                                id='streetData'
                                placeholder=''
                                value={formik.values.streetData}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.streetData && formik.errors.streetData ? (
                                <div className='text-danger'>{formik.errors.streetData}</div>
                            ) : null}
                        </div>
                    </div>

                    <hr />

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
                                value={formik.values.currentPassword}
                                onChange={formik.handleChange}
                            />
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
                                value={formik.values.newPassword}
                                onChange={formik.handleChange}
                            />
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
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                            />
                        </div>
                    </div>

                    <div className='ServiceDeatils my-5 d-flex justify-content-end'>
                        <button type='submit' className='border-0 p-2' disabled={formik.isSubmitting}>
                            Update Info
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserEditAccount;

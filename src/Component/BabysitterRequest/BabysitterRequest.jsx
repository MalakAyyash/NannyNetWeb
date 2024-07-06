import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik'
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import axios from 'axios';

const schema = Yup.object({ // validation 
    fname: Yup.string().required('First Name is required'),
    lname: Yup.string().required('Last Name is required'),
    username: Yup.string().required('Username is required'),
    email: Yup.string().required('Email is required').email('Invalid Email'),
    telNumber: Yup.string().required('Phone Number is required'),
    gender: Yup.string().required('Gender is required'),
    city: Yup.string().required('City is required'),
    password: Yup.string()
      .required('Password is required')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
        'Password must contain at least one letter and one number, and be at least 6 characters long'
      ),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

function BabysitterRequest() {

  const formik = useFormik({
    initialValues: {
      fname: '',
      lname: '',
      email: '',
      username: '',
      password: '',
      telNumber: '',
      gender: 'male',
      city: 'Ramallah',
      describtion:'',
      accountNumber: '',
      type:'above 5Y old',
      date:'',
    },
    validationSchema: schema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const { fname, lname, ...otherValues } = values;
        const name = `${fname} ${lname}`;
        const dataToSend = { ...otherValues, name };
        const response = await axios.post('http://176.119.254.188:8080/signup/provider', dataToSend);
        if (response.status === 200) {
          Swal.fire({
            title: "Great!",
            text: "wait for the admin approval!",
            icon: "success",
            didOpen: () => {
              const confirmButton = Swal.getConfirmButton();
              confirmButton.style.backgroundColor = "rgb(194, 39, 75)";
              confirmButton.style.color = "white";
            }
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: response.data.error || "An unknown error occurred.",
            icon: "error",
          });
        }
      }  catch (error) {
        if (error.response && error.response.status === 409) { // Check if it's a conflict error (username or email already in use)
          Swal.fire({
            title: "Error!",
            text: "Username or email already in use.",
            icon: "error",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/';
          }
        });
        } else {
          Swal.fire({
            title: "Error!",
            text: "An unexpected error occurred. Please try again later.",
            icon: "error",
          });

        }
      }
      
    }
  });

  return (
    <>
    
      <div className=' Book-container-fluid my-5 pt-5'>
        <div className="row mt-5 pt-5">
          <div className="col-md-8">
            <div className='DetaliedBook'>
              <div className=""><p className='pt-2'>Babysitter Request</p></div>
              <hr></hr>
              <div>
                <div class="mb-3">
                  <form onSubmit={formik.handleSubmit} >
                    <div className='form'>
                      <div className=" row pb-3">
                        <div className=" col-md-6 form-outline">
                          <label htmlFor="fname" className="form-label">First Name</label>
                          <input type="text" className="form-control " id="fname" placeholder="" value={formik.values.fname} onChange={formik.handleChange} />
                          <p className='text-danger small'>{formik.errors.fname}</p>
                        </div>
                        <div className=" col-md-6 form-outline">
                          <label htmlFor="lname" className="form-label">Last Name</label>
                          <input type="text" className="form-control " id="lname" placeholder="" value={formik.values.lname} onChange={formik.handleChange} />
                          <p className='text-danger small'>{formik.errors.lname}</p>
                        </div>
                        <div className="form-outline col-md-6">
                          <label htmlFor="username" className="form-label">Username</label>
                          <input type="text" className="form-control" id="username" placeholder="" value={formik.values.username} onChange={formik.handleChange} />
                          <p className='text-danger small'>{formik.errors.username}</p>

                        </div>
                        <div className="form-outline col-md-6">
                          <label htmlFor="email" className="form-label">Email address</label>
                          <input type="email" className="form-control" id="email" placeholder="name@example.com" value={formik.values.email} onChange={formik.handleChange} />
                          <p className='text-danger small'>{formik.errors.email}</p>

                        </div>
                        <div className='col-md-6 form-outline'>
                          <label htmlFor="telNumber" className="form-label">Phone</label>
                          <input type="text" className="form-control" id="telNumber" placeholder="" value={formik.values.telNumber} onChange={formik.handleChange} />
                          <p className='text-danger small'>{formik.errors.telNumber}</p>
                        </div>
                        <div className=" col-md-6 form-outline">
                          <label htmlFor="gender" className="form-label">Gender</label>
                          <select class="form-select" id="gender" aria-label="Default select example" name="gender" value={formik.values.gender} onChange={formik.handleChange}>
                            <option value="male">male</option>
                            <option value="female">female</option>
                          </select>
                          <p className='text-danger small'>{formik.errors.gender}</p>
                        </div>
                        <div className=" col-md-6 form-outline">
                          <label htmlFor="city" className="form-label">City Location</label>
                          <select class="form-select" id="city" aria-label="Default select example" name="city" value={formik.values.city} onChange={formik.handleChange}>
                            <option value="Ramallah">Ramallah</option>
                            <option value="Nablus">Nablus</option>
                            <option value="Salfit">Salfeet</option>
                          </select>
                          <p className='text-danger small'>{formik.errors.city}</p>
                        </div>
                       
                        <div className=" form-outline">
                          <label htmlFor="describtion" className="form-label">Extra Description</label>
                          <textarea className="form-control" id="describtion" rows={3} defaultValue={""} value={formik.values.describtion} onChange={formik.handleChange} />
                        </div>

                        <div className=" form-outline">
                          <label htmlFor="accountNumber" className="form-label">accountNumber</label>
                          <input type='text' className="form-control" id="accountNumber" value={formik.values.accountNumber} onChange={formik.handleChange} />
                        </div>

                        <div className=" form-outline">
                          <label htmlFor="type" className="form-label">Type</label>
                          <select class="form-select" id="type" aria-label="Default select example" name="type" value={formik.values.type} onChange={formik.handleChange}>
                            <option value="above 5Y old">above 5Y old</option>
                            <option value="Under 5Y old">Under 5Y old</option>
                            <option value="Medical">Medical</option>
                            <option value="Special Care">Special Care</option>
                          </select>
                          <p className='text-danger small'>{formik.errors.type}</p>
                        </div>

                        <div className=" form-outline">
                          <label htmlFor="date" className="form-label">date</label>
                          <input type='date' className="form-control" id="date" value={formik.values.date} onChange={formik.handleChange} />
                        </div>

                        <div className='col-md-6 form-outline'>
                          <label htmlFor="password" className="form-label">Password</label>
                          <input type="password" className="form-control" id="password" placeholder="" value={formik.values.password} onChange={formik.handleChange} />
                          <p className='text-danger small'>{formik.errors.password}</p>
                        </div>
                        <div className='col-md-6 form-outline'>
                          <label htmlFor="confirmPassword" className="form-label"> Confirm Password</label>
                          <input type="password" className="form-control" id="confirmPassword" placeholder="" value={formik.values.confirmPassword} onChange={formik.handleChange} />
                          <p className='text-danger small'>{formik.errors.confirmPassword}</p>
                        </div>
                      </div>
                      <div className='ServiceDeatils'>
                        <button className='mt-3 btn w-100 ' type="submit" >Sign Up </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BabysitterRequest;
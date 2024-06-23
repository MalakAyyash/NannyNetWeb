import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik'
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import axios from 'axios';

const schema = Yup.object({ // validation 
  fname: Yup.string().required("First Name is required"),
  lname: Yup.string().required("Last Name is required"),
  username: Yup.string().required("Username is required"),
  email: Yup.string().required("Email is required").email('not valid Email'),
  telNumber: Yup.number().required("Number is required"),
  streetData: Yup.string().required("Area is required"),
  confirmPassword: Yup.string().required("Confirm Password is required").oneOf([Yup.ref('password'), null], 'Passwords must match'),
  password: Yup.string()
    .required("Password is required")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, "Password must contain at least one letter and one number, and be at least 6 characters long"),
});
function SignUp() {

  const formik = useFormik({
    initialValues: {
      fname: '',
      lname: '',
      email: '',
      username: '',
      password: '',
      telNumber: '',
      gender: 'Male',
      city: 'Ramallah',
      streetData: '',
      extraDescription: '',
    },
    validationSchema: schema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const { fname, lname, city, streetData, extraDescription, ...otherValues } = values;
        const name = `${fname} ${lname}`;
        const location = { city, streetData, extraDescription};
        const dataToSend = { ...otherValues, name, location };
        const response = await axios.post('http://176.119.254.188:8080/signup/customer', dataToSend);
        console.log(response.data);
        if (response.status === 200) {
          Swal.fire({
            title: "Great!",
            text: "Signup successfully!",
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
              <div className=""><p className='pt-2'>Sign Up</p></div>
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
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                          <p className='text-danger small'>{formik.errors.gender}</p>
                        </div>
                        <div className=" col-md-6 form-outline">
                          <label htmlFor="city" className="form-label">City Location</label>
                          <select class="form-select" id="city" aria-label="Default select example" name="city" value={formik.values.city} onChange={formik.handleChange}>
                            <option value="Ramallah">Ramallah</option>
                            <option value="Nablus">Nablus</option>
                            <option value="Salfit">Salfeet</option>
                            <option value="Ramallah">BeitSahour</option>
                            <option value="Nablus">BeitLehem</option>
                            <option value="Salfit">Jenin</option>
                            <option value="Ramallah">Hebron</option>
                            <option value="Nablus">Qalqilya</option>
                            <option value="Salfit">Tulkarm</option>
                          </select>
                          <p className='text-danger small'>{formik.errors.city}</p>
                        </div>
                        <div className="col-md-6 form-outline">
                          <label htmlFor="streetData" className="form-label">Village/Street</label>
                          <input type="text" className="form-control" id="streetData" rows={1} defaultValue={""} value={formik.values.streetData} onChange={formik.handleChange} />
                          <p className='text-danger small'>{formik.errors.streetData}</p>
                        </div>
                        <div className=" form-outline">
                          <label htmlFor="extraDescription" className="form-label">Extra Description</label>
                          <textarea className="form-control" id="extraDescription" rows={3} defaultValue={""} value={formik.values.extraDescription} onChange={formik.handleChange} />
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
                        <button className='mt-3 btn w-100 ' type="submit" onClick={() => console.log(formik.values)}>Sign Up</button>
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

export default SignUp;
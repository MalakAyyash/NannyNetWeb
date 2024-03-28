import React, { useState } from 'react';
import { useFormik } from 'formik'
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import axios from 'axios';

const schema = Yup.object({ // validation 
  fname: Yup.string().required("First Name is required"),
  lname: Yup.string().required("Last Name is required"),
  email: Yup.string().required("Email is required").email('not valid Email'),
  telNumber: Yup.number().required("Number is required"),
  area: Yup.string().required("Area is required"),
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string().required("Confirm Password is required").oneOf([Yup.ref('password'), null], 'Passwords must match'),
});
function SignUp() {
  const [requestId, setRequestId] = useState(1);
  const formik = useFormik({
    initialValues: {
      id: requestId, // Add requestId here
      fname: '',
      lname: '',
      email: '',
      telNumber: '',
      gender: 'Male',
      city: 'Ramallah',
      area: '',
      message: '',
      password: '',
    },
    validationSchema: schema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const { fname, lname, ...otherValues } = values;
        const name = `${fname} ${lname}`;
        const dataToSend = { ...otherValues, name };
        const response = await axios.post('http://176.119.254.188:8080/signup/customer', dataToSend);
        console.log(response.data); // Log response from the server
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
      } catch (error) {
        console.error('Error storing data:', error);
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
                            <option value="Salfit">Salfit</option>
                          </select>
                          <p className='text-danger small'>{formik.errors.city}</p>
                        </div>
                        <div className="col-md-6 form-outline">
                          <label htmlFor="area" className="form-label">Village/Street</label>
                          <input type="text" className="form-control" id="area" rows={1} defaultValue={""} value={formik.values.area} onChange={formik.handleChange} />
                          <p className='text-danger small'>{formik.errors.area}</p>
                        </div>
                        <div className=" form-outline">
                          <label htmlFor="message" className="form-label">Extra Description</label>
                          <textarea className="form-control" id="message" rows={3} defaultValue={""} value={formik.values.message} onChange={formik.handleChange} />
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
import React, {useState} from 'react'; 
import './BookingForm.css';
import { useFormik } from 'formik'
import * as Yup from 'yup';
import { ref, push, set, get, child } from 'firebase/database';
import { database} from '../Firebase/Firebase.jsx';
import {useNavigate } from 'react-router-dom';
// import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';


const schema = Yup.object({ // validation 
    name: Yup.string().required("Name is required"),
    email: Yup.string().required("Email is required").email('not valid Email'),
    massage: Yup.string().required("Massage is required"),
    country: Yup.string().required("Country is required"),
    city: Yup.string().required("City is required"),
    phone: Yup.number().required("Number is required"),
    area: Yup.string().required("Area is required"),

});

function BookingForm() {
  const formik = useFormik({
  initialValues:{
      name: '',
      email: '',
      phone: '',
      country: '',
      city: '',
      massage: '',
      area: '',

  },
  validationSchema:schema,
  validateOnChange: true,
  validateOnBlur: true,
  onSubmit:async (values) => {
    try {

    const orderRef = ref(database, 'order');
    const newOrderEntry = push(orderRef); 
    const orderKey = newOrderEntry.key;

    await set(newOrderEntry, {
        name: values.name,
        email: values.email,
        phone: values.phone,
        country: values.country,
        city: values.city,
        massage: values.massage,
        area: values.area,
    });
    console.log('Data stored successfully!' , values);

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
                    <div className="col-md 6"><p className='pt-2'>Client Details</p></div>
                    <hr></hr>
                    <div>
                        <div class="mb-3">
                        <form onSubmit={formik.handleSubmit} >

                            <div className='form'>
                                <div className="row pb-3">
                                    <div className=" form-outline col-md-6">
                                        <label htmlFor="name" className="form-label">Name</label>
                                        <input type="text" className="form-control "  id="name" placeholder="" value={formik.values.name}  onChange={formik.handleChange}/>
                                        <p className='text-danger small'>{formik.errors.name}</p>
                                    </div>
                                    <div className="form-outline col-md-6">
                                        <label htmlFor="email" className="form-label">Email address</label>
                                        <input type="email" className="form-control" id="email" placeholder="name@example.com" value={formik.values.email}  onChange={formik.handleChange}/>
                                        <p className='text-danger small'>{formik.errors.email}</p>

                                    </div>
                                </div>
                                <div className='form-outline'>
                                    <label htmlFor="phone" className="form-label">Phone</label>
                                    <input type="text" className="form-control" id="phone" placeholder="" value={formik.values.phone}  onChange={formik.handleChange} />
                                    <p className='text-danger small'>{formik.errors.phone}</p>

                                </div>
                                <div className=" form-outline mb-3 pt-4">
                                    <label htmlFor="massage" className="form-label">Add a Massage</label>
                                    <textarea className="form-control" id="massage" rows={3} defaultValue={""} value={formik.values.massage}  onChange={formik.handleChange}/>
                                    <p className='text-danger small'>{formik.errors.massage}</p>

                                </div>
                                <div className=" form-outline">
                                <label htmlFor="country" className="form-label pt-3">Country Location</label>
                                <select class="form-select" id="country" aria-label="Default select example" name="country" value={formik.values.country}  onChange={formik.handleChange}> 
                                    <option value="Palestine">Palestine</option>
                                    <option value="Jordan">Jordan</option>
                                    <option value="Lebanon">Lebanon</option>
                                </select>
                                <p className='text-danger small'>{formik.errors.country}</p>
                                </div>
                                <div className=" form-outline">

                                <label htmlFor="city" className="form-label pt-4">City Location</label>
                                <select class="form-select" id="city" aria-label="Default select example"   name="city" value={formik.values.city}  onChange={formik.handleChange}>
                                    <option value="Ramallah">Ramallah</option>
                                    <option value="Nablus">Nablus</option>
                                    <option value="Salfit">Salfit</option>
                                </select>
                                <p className='text-danger small'>{formik.errors.city}</p>
                                </div>
                                <div className="form-outline mb-3 pt-4">
                                    <label htmlFor="area" className="form-label pt-2">Add Your Area</label>
                                    <textarea className="form-control" id="area" rows={1} defaultValue={""} value={formik.values.area}  onChange={formik.handleChange}/>
                                    <p className='text-danger small'>{formik.errors.area}</p>

                                </div>
                                <button className='mt-3 btn w-100' type="submit" onClick={() => console.log(formik.values)}>Book Now</button>

                            </div>

                            </form>
                            </div>
                        </div>
            </div>
        </div>
        <div className="col-md-4 pt-4 px-5">
        <div className="BookingForm">
            <p className=''>Booking Details</p>
            <div className='mt-4 my-3 py-3 ServiceDeatils'>
                <p className='text-dark'>Service Name</p>
                <p className='text-dark'>Date and Time</p>
                
                <p className='small'>Staff</p>
                <p className='small'>Duration</p>
            </div>
            <hr></hr>
            <div className='mt-2 my-5 py-3 ServiceDeatils'>
                <p className='text-dark'>Payment Details</p>
                <div className="row pt-3">
                    <div className="col-md-6"><p className='text-dark'>Total</p></div>
                    <div className="col-md-6"><p className='text-dark d-flex justify-content-end'>$10</p></div>
                </div>
                <button className='mt-3 btn w-100'>Book Now</button>
            </div>
          </div>
        </div>
    </div>

    </div>
    
    </>
  );
}

export default BookingForm;

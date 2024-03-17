import React, { useState } from 'react';
import { useFormik } from 'formik'
import * as Yup from 'yup';
import { ref, push, set, get, child } from 'firebase/database';
import { database } from '../Firebase/Firebase.jsx';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';
import './BabysitterRequest.css';

const schema = Yup.object({ // validation 
    fname: Yup.string().required("First Name is required"),
    lname: Yup.string().required("Last Name is required"),
    age: Yup.date().required("Birth Date is required"),
    email: Yup.string().required("Email is required").email('not valid Email'),
    massage: Yup.string().required("Massage is required"),
    country: Yup.string().required("Country is required"),
    city: Yup.string().required("City is required"),
    phone: Yup.number().required("Number is required"),
    area: Yup.string().required("Area is required"),
    type: Yup.array().min(1, 'Babysitter type is required'),
    photo: Yup.string().required("Image is required"),
});
function BabysitterRequest() {
    const formik = useFormik({
        initialValues: {
            fname: '',
            lname: '',
            age: null,
            email: '',
            type: [],
            phone: '',
            country: '',
            city: '',
            massage: '',
            area: '',
            photo: '',
        },
        validationSchema: schema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values) => {
            try {
                const formattedBirthdate = values.age.toLocaleDateString('en-US');
                let totalPrice = 10;  // Base price for underFive or aboveFive
                if (values.type.includes('medical')) {
                    totalPrice += 5;  // Additional price for medical babysitter
                }
                if (values.type.includes('specialcare')) {
                    totalPrice += 10;  // Additional price for special care babysitter
                }
                const orderRef = ref(database, 'BabysitterRequest');
                const newOrderEntry = push(orderRef);
                const orderKey = newOrderEntry.key;
                await set(newOrderEntry, {
                    id: orderKey,
                    fname: values.fname,
                    lname: values.lname,
                    age: formattedBirthdate,
                    email: values.email,
                    type: values.type,
                    phone: values.phone,
                    country: values.country,
                    city: values.city,
                    massage: values.massage,
                    area: values.area,
                    photo: values.photo,
                    price: totalPrice,
                });
                Swal.fire({
                    title: "Great!",
                    text: "Your Request was sent!",
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
                                                    <label htmlFor="email" className="form-label">Email address</label>
                                                    <input type="email" className="form-control" id="email" placeholder="name@example.com" value={formik.values.email} onChange={formik.handleChange} />
                                                    <p className='text-danger small'>{formik.errors.email}</p>
                                                </div>
                                                <div className='col-md-6 form-outline'>
                                                    <label htmlFor="phone" className="form-label">Phone</label>
                                                    <input type="text" className="form-control" id="phone" placeholder="" value={formik.values.phone} onChange={formik.handleChange} />
                                                    <p className='text-danger small'>{formik.errors.phone}</p>
                                                </div>
                                                <div className='col-md-6 form-outline'>
                                                    <label htmlFor="age" className="form-label">Birth Date</label>
                                                    <br></br>
                                                    <DatePicker
                                                        selected={formik.values.age}
                                                        onChange={(date) => formik.setFieldValue('age', date)}
                                                        dateFormat="MM/dd/yyyy"
                                                        placeholderText="MM/DD/YYYY"
                                                        className="form-control"
                                                    />
                                                    <p className='text-danger small'>{formik.errors.age}</p>
                                                </div>
                                                <div className="col-md-6 form-outline">
                                                    <label htmlFor="country" className="form-label ">Country Location</label>
                                                    <select class="form-select" id="country" aria-label="Default select example" name="country" value={formik.values.country} onChange={formik.handleChange}>
                                                        <option value="Palestine">Palestine</option>
                                                        <option value="Jordan">Jordan</option>
                                                        <option value="Lebanon">Lebanon</option>
                                                    </select>
                                                    <p className='text-danger small'>{formik.errors.country}</p>
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
                                                    <textarea className="form-control" id="area" rows={1} defaultValue={""} value={formik.values.area} onChange={formik.handleChange} />
                                                    <p className='text-danger small'>{formik.errors.area}</p>
                                                </div>
                                                <div className="ms-2 form-outline pt-3">
                                                    <p>Babysitter type</p>
                                                    <input type="checkbox" id="medical" name="type" value='medical' onChange={(e) => {
                                                        formik.setFieldValue(
                                                            'type',
                                                            e.target.checked
                                                                ? [...formik.values.type, e.target.value]
                                                                : formik.values.type.filter((type) => type !== e.target.value)
                                                        );
                                                    }}
                                                        checked={formik.values.type.includes('medical')} />
                                                    <label className="m-2" for="medical">Medical Babysitter</label>
                                                    <br />
                                                    <input type="checkbox" id="specialcare" name="type" value="specialcare" onChange={(e) => {
                                                        formik.setFieldValue(
                                                            'type',
                                                            e.target.checked
                                                                ? [...formik.values.type, e.target.value]
                                                                : formik.values.type.filter((type) => type !== e.target.value)
                                                        );
                                                    }}
                                                        checked={formik.values.type.includes('specialcare')} />
                                                    <label className="m-2" for="specialcare">Spetialcare Babysitter</label>
                                                    <br />
                                                    <input type="checkbox" id="underFive" name="type" value="underFive" onChange={(e) => {
                                                        formik.setFieldValue(
                                                            'type',
                                                            e.target.checked
                                                                ? [...formik.values.type, e.target.value]
                                                                : formik.values.type.filter((type) => type !== e.target.value)
                                                        );
                                                    }}
                                                        checked={formik.values.type.includes('underFive')} />
                                                    <label className="m-2" for="underFive">Under 5 years Babysitter</label>
                                                    <br />
                                                    <input type="checkbox" id="aboveFive" name="type" value="aboveFive" onChange={(e) => {
                                                        formik.setFieldValue(
                                                            'type',
                                                            e.target.checked
                                                                ? [...formik.values.type, e.target.value]
                                                                : formik.values.type.filter((type) => type !== e.target.value)
                                                        );
                                                    }}
                                                        checked={formik.values.type.includes('aboveFive')} />
                                                    <label className="m-2" for="aboveFive">Above 5 years Babysitter</label><br /><br />
                                                    <p className='text-danger small'>{formik.errors.type}</p>
                                                </div>
                                                <div className="form-outline">
                                                    <label htmlFor="photo" className="form-label">Profile Image</label>
                                                    <input type="text" className="form-control " id="photo" placeholder="" value={formik.values.photo} onChange={formik.handleChange} />
                                                    <p className='text-danger small'>{formik.errors.photo}</p>
                                                </div>
                                                <div className=" form-outline">
                                                    <label htmlFor="massage" className="form-label">Add a Massage</label>
                                                    <textarea className="form-control" id="massage" rows={3} defaultValue={""} value={formik.values.massage} onChange={formik.handleChange} />
                                                    <p className='text-danger small'>{formik.errors.massage}</p>
                                                </div>
                                            </div>
                                            <div className='ServiceDeatils'>
                                                <button className='mt-3 btn w-100 ' type="submit" onClick={() => console.log(formik.values)}>Apply Now</button>
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

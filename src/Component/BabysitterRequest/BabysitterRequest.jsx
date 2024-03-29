import React, { useState } from 'react';
import { useFormik } from 'formik'
import * as Yup from 'yup';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';
import './BabysitterRequest.css';

const schema = Yup.object({ // validation 
    fname: Yup.string().required("First Name is required"),
    lname: Yup.string().required("Last Name is required"),
    date: Yup.date().required("Birth Date is required"),
    email: Yup.string().required("Email is required").email('not valid Email'),
    telNumber: Yup.number().required("Number is required"),
    area: Yup.string().required("Area is required"),
    accountNumber: Yup.number().required("Account Number is required"),
    // type: Yup.array().min(1, 'Babysitter type is required'),
    username: Yup.string().required("Username is required"),

});


function BabysitterRequest() {
    const [requestId, setRequestId] = useState(1);

    const formik = useFormik({
        initialValues: {
            id: 123456789,
            fname: '',
            lname: '',
            date: null,
            password: 'Xyz456',
            email: '',
            type: 'medical',
            telNumber: '',
            city: '',
            description: '',
            accountNumber: '',
            gender: '',
            username: '',

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
                const response1 = await axios.get('http://176.119.254.188:8080/signup/customer');

                console.log(response1.data); // Log response from the server

                console.log(response.data); // Log response from the server
                console.log(response.status); // Log response from the server

                setRequestId(prevId => prevId + 1); // Increment request ID
                const formattedBirthdate = values.age.toLocaleDateString('en-US');
                let totalPrice = 10;  // Base price for underFive or aboveFive
                if (values.type.includes('medical')) {
                    totalPrice += 5;  // Additional price for medical babysitter
                }
                if (values.type.includes('specialcare')) {
                    totalPrice += 10;  // Additional price for special care babysitter
                }
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
                                                <div className="form-outline col-md-6">
                                                    <label htmlFor="username" className="form-label">Username</label>
                                                    <input type="text" className="form-control" id="username" placeholder="name@example.com" value={formik.values.username} onChange={formik.handleChange} />
                                                    <p className='text-danger small'>{formik.errors.username}</p>
                                                </div>
                                                <div className='col-md-6 form-outline'>
                                                    <label htmlFor="telNumber" className="form-label">Phone</label>
                                                    <input type="text" className="form-control" id="telNumber" placeholder="" value={formik.values.telNumber} onChange={formik.handleChange} />
                                                    <p className='text-danger small'>{formik.errors.telNumber}</p>
                                                </div>
                                                <div className='col-md-6 form-outline'>
                                                    <label htmlFor="date" className="form-label">Birth Date</label>
                                                    <br></br>
                                                    <input type="date" className="form-control " id="date" placeholder="" value={formik.values.date} onChange={formik.handleChange} />                                            
                                                    <p className='text-danger small'>{formik.errors.date}</p>
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
                                                <div className='col-md-6 form-outline'>
                                                    <label htmlFor="accountNumber" className="form-label">Account Number</label>
                                                    <input type="text" className="form-control" id="accountNumber" placeholder="" value={formik.values.accountNumber} onChange={formik.handleChange} />
                                                    <p className='text-danger small'>{formik.errors.accountNumber}</p>
                                                </div>
                                                {/* <div className="ms-2 form-outline pt-3">
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
                                                </div>*/}
                                                <div className=" form-outline">
                                                    <label htmlFor="description" className="form-label">Description</label>
                                                    <textarea className="form-control" id="description" rows={3} defaultValue={""} value={formik.values.description} onChange={formik.handleChange} />
                                                    <p className='text-danger small'>{formik.errors.description}</p>
                                                </div> 
                                            </div>
                                            <div className='ServiceDeatils'>
                                                <button className='mt-3 btn w-100 ' type="submit" onClick={() => console.log(formik.values)}>Apply Now</button>
                                             <button></button>
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

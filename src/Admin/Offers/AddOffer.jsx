import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';


function AddOffer() {
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('1m'); // Default duration
  const [maxHours, setMaxHours] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [timesAllowed, setTimesAllowed] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
        const token = Cookies.get('jwt');
        if (!token) {
          console.error('Token not found.');
          return;
        }
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      const requestBody = {
        description,
        duration,
        maxHours,
        discountPercentage,
        timesAllowed,
      };

      const response = await axios.post(
        'http://176.119.254.188:8080/admin/offerType/add',
        requestBody,config
      );



      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Offer Added',
          text: 'The offer package has been successfully added.',
        });
        // Clear form fields after successful submission if needed
        setDescription('');
        setDuration('1m'); // Reset duration to default after submission
        setMaxHours('');
        setDiscountPercentage('');
        setTimesAllowed('');
      } else {
        throw new Error('Failed to add offer');
      }
    } catch (error) {
      console.error('Error adding offer:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to add offer. Please try again later.',
      });
    }
  };

  return (
    <div className="container mt-4">
      <div className='DetaliedBook'>
      <p className='fst-normal'>Add Offer</p>
      </div>
      <p className='small text-secondary fst-normal'>Fill in the details below to add a new offer.</p>
      <hr></hr>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input
            placeholder='Enter a description of the offer'
            type="text"
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="duration" className="form-label" >Duration</label>
          <select
            className="form-select"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          >
            <option value="1m">1m</option>
            <option value="2m">2m</option>
            <option value="3m">3m</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="maxHours" className="form-label">Max Hours</label>
          <input
            placeholder='Enter the max houres per request '
            type="number"
            className="form-control"
            id="maxHours"
            value={maxHours}
            onChange={(e) => setMaxHours(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="discountPercentage" className="form-label">Discount Percentage</label>
          <input
            placeholder='Enter the discount precentage of the offer'
            type="number"
            className="form-control"
            id="discountPercentage"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="timesAllowed" className="form-label">Times Allowed</label>
          <input
            placeholder='Enter the numbers of request allowed'
            type="number"
            className="form-control"
            id="timesAllowed"
            value={timesAllowed}
            onChange={(e) => setTimesAllowed(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn BlueColor text-light rounded-0 w-100">ADD OFFER</button>
      </form>
    </div>
  );
}

export default AddOffer;

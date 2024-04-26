import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2'; // Import SweetAlert library
import './DetailedBook.css';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';


// Define TimePicker component here (if not already defined elsewhere)
const TimePicker = ({ selectedTime, handleTimeChange }) => {
  return (
    <div>
      <DatePicker
        selected={selectedTime}
        onChange={handleTimeChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        dateFormat="h:mm aa"
        placeholderText="Select time"
      />
    </div>
  );
};

function DetailedBook() {
  const [startDate, setStartDate] = useState(new Date());
  const [value1, setValue1] = useState('09:00 PM');
  const [value2, setValue2] = useState('05:00 PM');
  const [customerData, setCustomerData] = useState('05:00 PM');
  const [numOfKids, setNumOfKids] = useState(1);
  const [city, setCity] = useState('');
  const [streetData, setStreetData] = useState('');
  const [extraDescription, setExtraDescription] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTime1, setSelectedTime1] = useState(null);
  const [selectedTime2, setSelectedTime2] = useState(null);
  const { id } = useParams(); // Get the ID parameter from the URL
  

  const handleTimeChange1 = (time) => {
    setSelectedTime1(time);
  };

  const handleTimeChange2 = (time) => {
    setSelectedTime2(time);
  };

  const handleNumOfKidsChange = (e) => {
    const value = parseInt(e.target.value, 10); // Parse input value as an integer
    if (!isNaN(value) && value >= 1) {
      setNumOfKids(value); // Update numOfKids state if value is valid (1 or more)
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseCustomer = await fetch(`http://176.119.254.188:8080/customer/${Cookies.get('userId')}`);
        if (responseCustomer.ok) {
          const data = await responseCustomer.json();
          setCustomerData(data); // Update customerData state with fetched data
        setCity(data.location.city || ''); // Set city to customer's location city
        setStreetData(data.location.streetData || ''); // Set city to customer's location city

        }
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once on mount


  const handleSubmit = async () => {
    const token = Cookies.get('jwt');
  
    // Format selected times from 24-hour format to 12-hour format with AM/PM
    const formattedStartTime = selectedTime1.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
    const formattedEndTime = selectedTime2.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  
    const dataToSend = {
      orderDate: startDate.toISOString().slice(0, 10),
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      employeeId: id,
      description: description,
      numOfKids: numOfKids,
      location: {
        city: city,
        streetData: streetData,
        extraDescription: extraDescription
      }
    };
  
    try {
      const response = await axios.post('http://176.119.254.188:8080/customer/order/request', dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.status === 200) {
        Swal.fire({
          title: "Great!",
          text: "Appointment request submitted successfully!",
          text: "Wait for the babysitter approval",
          icon: "success"
        });
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      Swal.fire({
        title: "Oops!",
        text: "Something went wrong. Please try again.",
        icon: "error"
      });
    }
  };
  

  return (
    <div className='DetailedBook Book-container-fluid mt-5 pt-5'>
      <p className='DetailedBookTitle'>Appointment</p>
      <div className="row border-bottom mb-3">
        <div className="col-md-6"><p className='pt-2'>Select Date and Time</p></div>
        <div className="col-md-6"><p className='d-flex justify-content-center pt-2'>Service Details</p></div>
      </div>

      <div className="row">
        <div className='mb-5 col-md-4'>
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            minDate={new Date()}
            inline
            showDisabledMonthNavigation
          />
        </div>
        <div className='mb-5 col-md-4 ps-5 ms-5'>
          <p>{startDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p>From :</p>
          <TimePicker selectedTime={selectedTime1} handleTimeChange={handleTimeChange1} />
          <br />
          <p>To :</p>
          <TimePicker selectedTime={selectedTime2} handleTimeChange={handleTimeChange2} />
          <label htmlFor="numOfKids" className='mt-4 mb-3'>Number of kids</label>
          <br></br>
          <input
            type="number"
            id="numOfKids"
            placeholder='Number of Kids'
            value={numOfKids}
            onChange={handleNumOfKidsChange}
            min={1} // Minimum value allowed is 1
            step={1} // Increment step is 1
          />
        </div>
        <div className="col-md-3 px-5">
          <div className="BookingForm">
            <p className='normalFont'>Location</p>
            <div className='ServiceDetails'>
              <input type="text" id="city" placeholder='City' className='mb-1' value={city} onChange={e => setCity(e.target.value)} />
              <input type="text" id="streetData" className='mb-1' placeholder='Street Address' value={streetData} onChange={e => setStreetData(e.target.value)} />
              <input type="text" id="extraDescription" className='mb-1' placeholder='Additional Description' value={extraDescription} onChange={e => setExtraDescription(e.target.value)} />
              <br />
              <hr />
            </div>
            <p className='normalFont'>Description</p>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
            <br />
            <hr />
            <div className='ServiceDetails'>
              <button onClick={handleSubmit} className='my-3 btn w-100'>NEXT</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailedBook;

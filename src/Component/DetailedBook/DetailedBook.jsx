import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addMonths } from 'date-fns';
import './DetailedBook.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { Link as RouterLink, useParams } from 'react-router-dom';
import BabysitterData from '../BabysitterData/BabysitterData';


function DetailedBook() {
  const babysitterData = BabysitterData(); // get the data of the babysitter
  const { babysitterKey } = useParams();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [value1, setValue1] = useState('00:00');
  const [value2, setValue2] = useState('00:00');
  const [duration, setDuration] = useState(null);

  const calculateDuration = () => {
    if (value1 && value2) {
      const time1 = new Date(`2000-01-01T${value1}:00`);
      const time2 = new Date(`2000-01-01T${value2}:00`);
  
      if (isNaN(time1) || isNaN(time2)) {
        console.error('Invalid time format');
        setDuration(null);
        return;
      }
  
      const timeDifference = Math.abs(time2 - time1);
      const durationInHours = timeDifference / (1000 * 60 * 60); // Convert milliseconds to hours
      setDuration(durationInHours);
    } else {
      setDuration(null);
    }
  };
  
  
  

  const handleTimeChange1 = (newTime) => {
    setValue1(newTime);
    calculateDuration();
  };

  const handleTimeChange2 = (newTime) => {
    setValue2(newTime);
    calculateDuration();
  };



  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  if (babysitterData.hasOwnProperty(babysitterKey)) {
    const selectedBabysitter = babysitterData[babysitterKey];
    const pricePerHour = selectedBabysitter.price;

  return (
    <>
      <div className='DetaliedBook Book-container-fluid mt-5 pt-5'>
        <p className='DetaliedBookTitle'>Appointment</p>
        <div className="row border-bottom mb-3">
          <div className=''>
            <div className="row">
              <div className="col-md 6"><p className='pt-2'>Select Date and time</p></div>
              <div className="col-md 6 d-flex justify-content-center"><p className='pt-2'>Service Details</p></div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className='mb-5 col-md-4'>
            <DatePicker
              selected={startDate}
              onChange={onChange}
              minDate={new Date()}
              maxDate={addMonths(new Date(), 5)}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              inline
              showDisabledMonthNavigation
            />
          </div>
          <div className='mb-5 col-md-4 ps-5 ms-5'>
            <p>{startDate.toLocaleDateString('en-US', options)}</p>
            <p>From :</p>
            <TimePicker onChange={handleTimeChange1} value={value1} className='mb-3' />
            <br></br>
            <p>To :</p>
            <TimePicker onChange={handleTimeChange2} value={value2} />
          </div>
          <div className="col-md-3 ServiceDeatils">
            <div className='mb-4'>
              
              <p className='text-dark'>{selectedBabysitter.type}</p>
              <p>{selectedBabysitter.fname} {selectedBabysitter.lname}</p>
              {duration !== null && (
  <div>
    <p>Duration: {duration.toFixed(2)} Hours</p>
    <p>Total Price: ${duration !== null ? duration * pricePerHour : 0}</p>
  </div>
)}
            </div>
            <hr></hr>
            <RouterLink to="/BookingForm" ><button className='mt-3 btn w-100'>NEXT</button></RouterLink>


          </div>
        </div>
      </div>
    </>
  );
}
}
export default DetailedBook;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Bookings.css'; // Import custom CSS for tooltips

function UserRequestTable() {
    const [filteredRentData, setFilteredRentData] = useState([]);
    const [activeWeekIndex, setActiveWeekIndex] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [weekData, setWeekData] = useState({
        schedule: [],
        weekStartDate: null,
        weekEndDate: null
    });

    const timeSlots = [
        '12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM',
        '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
        '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
        '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'
    ];

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (filteredRentData.length > 0) {
            handleDateChange(selectedDate);
        }
    }, [filteredRentData, selectedDate]);

    const fetchData = async () => {
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

            const response = await axios.get('http://176.119.254.188:8080/customer/orders/pending', config);

            if (response && response.data) {
                const bookings = response.data;
                setFilteredRentData(bookings);
            } else {
                console.log('No data returned from API');
                setFilteredRentData([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Unknown error occurred.',
            });
        }
    };

    const generateWeekData = (startDate) => {
        const weekStartDate = new Date(startDate);
        weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay()); // Start of the week (Sunday)
        const weekEndDate = new Date(weekStartDate);
        weekEndDate.setDate(weekEndDate.getDate() + 6); // End of the week (Saturday)

        const schedule = daysOfWeek.map(() => Array.from({ length: timeSlots.length }, () => []));

        filteredRentData.forEach((booking) => {
            const startTime = new Date(booking.startTime);
            const endTime = new Date(booking.endTime);
            const startHour = startTime.getHours();
            const endHour = endTime.getHours();

            if (startTime >= weekStartDate && startTime <= weekEndDate) {
                const dayOfWeek = startTime.getDay(); // Get day index (0 = Sunday, 1 = Monday, ...)
                const startIndex = timeSlots.findIndex((slot) => slot.startsWith(`${startHour.toString().padStart(2, '0')}:`));
                const endIndex = timeSlots.findIndex((slot) => slot.startsWith(`${endHour.toString().padStart(2, '0')}:`));

                if (startIndex !== -1 && endIndex !== -1) {
                    for (let i = startIndex; i <= endIndex; i++) {
                        schedule[dayOfWeek][i].push(booking);
                    }
                }
            }
        });

        return { schedule, weekStartDate, weekEndDate };
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const { schedule, weekStartDate, weekEndDate } = generateWeekData(date);
        const weekData = { schedule, weekStartDate, weekEndDate };
        setActiveWeekIndex(0);
        setWeekData(weekData);
    };

    const renderBookingTooltip = (booking) => {
        const startTime = new Date(booking.startTime).toLocaleString();
        const endTime = new Date(booking.endTime).toLocaleString();
        return `Start Time: ${startTime}, End Time: ${endTime}`;
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-6">
                <p>
                        <span style={{ color: '#c2274b' }}> From </span>
                        <span>{weekData.weekStartDate?.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span style={{ color: '#c2274b' }}> To </span>
                        <span>{weekData.weekEndDate?.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </p>
                </div>
                <div className="col-md-6 d-flex justify-content-end">
                <div style={{ marginBottom: '20px' }}>
                <span style={{ color: '#c2274b' }} className='px-2'> Pick a Date </span>

                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="MMMM d, yyyy"
                        />
                    </div>
                </div>
            </div>
            <div>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th></th>
                            {timeSlots.map((time) => (
                                <th key={time} style={{ fontSize: '10px' }}>{time}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {daysOfWeek.map((day, dayIndex) => (
                            <tr key={dayIndex}>
                                <td style={{ fontWeight: 'bold', fontSize: '10px' }}>{day}</td>
                                {weekData.schedule[dayIndex]?.map((bookings, hourIndex) => {
                                    const cellStyle = bookings.length > 0 ? { backgroundColor: '#c2274b' } : {};
                                    return (
                                        <td key={`${dayIndex}-${hourIndex}`} style={cellStyle}>
                                            {bookings.map((booking, index) => (

                                                <div key={index} className="custom-tooltip-container">
                                                    <div className="custom-tooltip" >
                                                        {renderBookingTooltip(booking)}
                                                    </div>
                                                </div>
                                            ))}
                                        </td>
                                    );
                                }) ?? (
                                        <td key={`empty-${dayIndex}`} style={{ backgroundColor: '#fff' }}>
                                            {/* Render an empty cell if bookings array is undefined or empty */}
                                        </td>
                                    )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserRequestTable;

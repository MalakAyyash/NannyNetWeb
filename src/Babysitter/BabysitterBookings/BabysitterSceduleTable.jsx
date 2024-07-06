import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

function BabysitterSceduleTable() {
    const localizer = momentLocalizer(moment);
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        fetchData();
    }, []);

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

            const response = await axios.get('http://176.119.254.188:8080/provider/orders/submitted', config);

            if (response && response.data) {
                const bookings = response.data.map(booking => ({
                    title: `Booking ID: ${booking.id}`,
                    start: new Date(booking.startTime),
                    end: new Date(booking.endTime),
                    allDay: false, // Adjust based on your booking logic
                    bookingData: booking, // Store the entire booking object if needed
                }));
                setEvents(bookings);
            } else {
                console.log('No data returned from API');
                setEvents([]);
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

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const renderBookingTooltip = (event) => {
        const startTime = moment(event.start).format('MMMM Do YYYY, h:mm a');
        const endTime = moment(event.end).format('MMMM Do YYYY, h:mm a');
        return `Start Time: ${startTime}, End Time: ${endTime}`;
    };

    return (
        <div className="container mt-4 px-0">
            <div className="row">
            </div>
            <div>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    eventPropGetter={(event) => ({
                        style: {
                            backgroundColor: '#c2274b',
                            borderRadius: '5px',
                            opacity: 0.8,
                            color: 'white',
                            border: '1px solid #c2274b',
                            display: 'block',
                            padding: '5px',
                            margin: '1px',
                            cursor: 'pointer',
                            fontSize:'13px',
                        },
                        title: renderBookingTooltip(event.bookingData),
                    })}
                />
            </div>
        </div>
    );
}

export default BabysitterSceduleTable;

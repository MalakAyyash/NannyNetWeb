import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

const BabysitterStatus = () => {
  const { id } = useParams(); // Assuming `id` is the babysitterId
  const chartRef = useRef();
  const [data, setData] = useState([]);

  const fetchBabysitterData = async () => {
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

      const response = await axios.post(
        'http://176.119.254.188:8080/admin/order/get/employee',
        { employeeId: id },
        config
      );

      if (response && response.data) {
        console.log('Fetched data:', response.data); // Logging the response data
        setData(response.data);
      }
    } catch (error) {
      console.error('Error fetching babysitter data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Unknown error occurred.',
      });
    }
  };

  useEffect(() => {
    fetchBabysitterData();
  }, [id]);

  useEffect(() => {
    if (data.length === 0) {
      console.log('No data available to display'); // Logging if data is empty
      return;
    }

    // Parse and aggregate data by month
    const aggregatedData = data.reduce((acc, { date, totalOrders, cancelledOrders }) => {
      const month = new Date(date).getMonth();
      if (!acc[month]) {
        acc[month] = { totalOrders: 0, cancelledOrders: 0 };
      }
      acc[month].totalOrders += totalOrders;
      acc[month].cancelledOrders += cancelledOrders;
      return acc;
    }, {});

    const months = Object.keys(aggregatedData).map(month => {
      const date = new Date();
      date.setMonth(month);
      return date.toLocaleString('default', { month: 'long' });
    });

    const totalOrders = Object.values(aggregatedData).map(({ totalOrders }) => totalOrders);
    const cancelledOrders = Object.values(aggregatedData).map(({ cancelledOrders }) => cancelledOrders);

    const ctx = chartRef.current.getContext('2d');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Total Orders',
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // Color for the area under the line
            data: totalOrders,
          },
          {
            label: 'Cancelled Orders',
            borderColor: 'rgba(255, 206, 86, 1)',
            backgroundColor: 'rgba(255, 206, 86, 0.2)', // Color for the area under the line
            data: cancelledOrders,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default BabysitterStatus;

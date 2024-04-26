import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './AllCustomers.css';


const CustomerStatus = () => {
  const chartRef = useRef();

  const dummyOverallData = [
    { month: 'January', totalOrders: 50, cancelledOrders: 5 },
    { month: 'February', totalOrders: 60, cancelledOrders: 10 },
    { month: 'March', totalOrders: 70, cancelledOrders: 15 },
    { month: 'April', totalOrders: 80, cancelledOrders: 20 },
    { month: 'May', totalOrders: 90, cancelledOrders: 25 },
    { month: 'June', totalOrders: 100, cancelledOrders: 30 },
  ];

  useEffect(() => {
    if (dummyOverallData.length === 0) return;

    const months = dummyOverallData.map(({ month }) => month);
    const totalOrders = dummyOverallData.map(({ totalOrders }) => totalOrders);
    const cancelledOrders = dummyOverallData.map(({ cancelledOrders }) => cancelledOrders);

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
  }, [dummyOverallData]);

  return <canvas ref={chartRef}/>;
};

export default CustomerStatus;

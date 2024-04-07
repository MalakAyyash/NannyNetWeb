import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const UserCountChart = () => {
  const chartRef = useRef();

  const dummyData = {
    customerCount: 150,
    babysitterCount: 80,
    adminCount: 10,
  };

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Customers', 'Babysitters', 'Admins'],
        datasets: [{
          label: 'Number of Users',
          data: [dummyData.customerCount, dummyData.babysitterCount, dummyData.adminCount],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)', // Red for Customers
            'rgba(54, 162, 235, 0.5)', // Blue for Babysitters
            'rgba(255, 206, 86, 0.5)', // Yellow for Admins
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1,
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, []);

  return <canvas ref={chartRef} />;
};

export default UserCountChart;

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
            'rgb(0, 0, 0 ,.5)', 
            'rgb(0, 0, 0 ,.5)',
            'rgb(0, 0, 0 ,.5)',
          ],
          borderColor: [
            'rgb(0, 0, 0 ,1)',
            'rgb(0, 0, 0 ,1)',
            'rgb(0, 0, 0 ,1)',
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

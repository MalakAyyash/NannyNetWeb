import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ProfitAnalysisChart = () => {
  const chartRef = useRef();

  const dummyProfitData = [
    { month: 'January', profit: 500 },
    { month: 'February', profit: 600 },
    { month: 'March', profit: 300 },
    { month: 'April', profit: 800 },
    { month: 'May', profit: 500 },
    { month: 'June', profit: 1000 },
  ];

  useEffect(() => {
    if (dummyProfitData.length === 0) return;

    const months = dummyProfitData.map(({ month }) => month);
    const profitData = dummyProfitData.map(({ profit }) => profit);

    const ctx = chartRef.current.getContext('2d');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Profit',
            borderColor: 'rgba(0, 0, 0, 1)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)', // Color for the area under the line
            data: profitData,
            fill: {
              target: 'origin', // Fill area under the line from the beginning (origin) of the chart
            },
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        responsive: true,
        maintainAspectRatio: false, // Ensures the chart can resize to fit its container
      },
    });
  }, [dummyProfitData]);

  return <canvas ref={chartRef} style={{ maxWidth: '100%', height: '400px' }} />; // Adjust max-width and max-height as needed
};

export default ProfitAnalysisChart;

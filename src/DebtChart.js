import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DebtChart = ({ debts }) => {
  // Calculate total lent and borrowed from the debts state
  const totalLent = debts
    .filter(d => d.type === 'lent')
    .reduce((sum, d) => sum + d.amount, 0);

  const totalBorrowed = debts
    .filter(d => d.type === 'borrowed')
    .reduce((sum, d) => sum + d.amount, 0);

  const chartData = {
    labels: ['Money You Gave (Lent)', 'Money You Got (Borrowed)'],
    datasets: [
      {
        label: 'Amount',
        data: [totalLent, totalBorrowed],
        backgroundColor: [
          'rgba(52, 152, 219, 0.7)', // Blue for lent
          'rgba(241, 196, 15, 0.7)',   // Yellow for borrowed
        ],
        borderColor: [
          'rgba(52, 152, 219, 1)',
          'rgba(241, 196, 15, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y', // This makes the bar chart horizontal
    responsive: true,
    plugins: {
      legend: {
        display: false, // We don't need a legend for just one dataset
      },
      title: {
        display: false,
      },
    },
    scales: {
        y: {
            ticks: { color: '#A0A0A0', font: { size: 14 } },
            grid: { color: '#2D2D2D' }
        },
        x: {
            ticks: { color: '#A0A0A0' },
            grid: { color: '#2D2D2D' }
        }
    }
  };

  return (
    <div className="activity-chart card">
        <h3>IOU Totals</h3>
        <Bar options={options} data={chartData} />
    </div>
  );
};

export default DebtChart;
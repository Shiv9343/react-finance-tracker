import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, // Import Filler for gradient background
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TransactionChart = ({ transactions }) => {
  // We want to show the trend for the last 7 days
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toLocaleDateString('en-CA'); // YYYY-MM-DD format for easy sorting
  }).reverse();

  const dataByDay = last7Days.reduce((acc, date) => {
    acc[date] = { income: 0, expense: 0 };
    return acc;
  }, {});

  transactions.forEach(t => {
    if (t.createdAt) { // Ensure createdAt exists
        const transactionDate = new Date(t.createdAt.seconds * 1000).toLocaleDateString('en-CA');
        if (dataByDay[transactionDate]) {
        if (t.type === 'income') {
            dataByDay[transactionDate].income += t.amount;
        } else {
            dataByDay[transactionDate].expense += t.amount;
        }
        }
    }
  });

  const chartData = {
    labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })),
    datasets: [
      {
        label: 'Expense',
        data: last7Days.map(date => dataByDay[date].expense),
        borderColor: '#e74c3c',
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Income',
        data: last7Days.map(date => dataByDay[date].income),
        borderColor: '#2ecc71',
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
            color: '#A0A0A0' // Text color for legend
        }
      },
      title: {
        display: false, // We have our own title
      },
    },
    scales: {
        y: {
            ticks: { color: '#A0A0A0' },
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
        <h3>Activity</h3>
        <Line options={options} data={chartData} />
    </div>
  );
};

export default TransactionChart;
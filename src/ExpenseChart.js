import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// We need to register the components Chart.js will use
ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ expenses }) => {
  // Process the data to group expenses by category
  const categoryData = expenses.reduce((acc, expense) => {
    const { category, amount } = expense;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(categoryData), // e.g., ['Food', 'Transport', 'Shopping']
    datasets: [
      {
        label: 'Expenses by Category',
        data: Object.values(categoryData), // e.g., [500, 150, 300]
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Spending by Category',
      },
    },
  };

  return (
    <div className="chart-container">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default ExpenseChart;
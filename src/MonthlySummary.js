import React from 'react';
import { Link } from 'react-router-dom';

const MonthlySummary = ({ transactions }) => {
  
  // This is the core logic: Grouping transactions by month
  const monthlyData = transactions.reduce((acc, t) => {
    if (!t.createdAt) return acc; // Skip transactions without a timestamp

    // Create a 'YYYY-MM' key, e.g., "2025-10"
    const date = new Date(t.createdAt.seconds * 1000);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    // If this is the first transaction for this month, initialize it
    if (!acc[monthKey]) {
      acc[monthKey] = {
        totalIncome: 0,
        totalExpenses: 0,
        monthName: date.toLocaleString('default', { month: 'long', year: 'numeric' })
      };
    }

    // Add the amount to the correct total
    if (t.type === 'income') {
      acc[monthKey].totalIncome += t.amount;
    } else {
      acc[monthKey].totalExpenses += t.amount;
    }

    return acc;
  }, {});

  // Get the month keys (e.g., ["2025-10", "2025-09"]) and sort them so the newest month is first
  const sortedMonths = Object.keys(monthlyData).sort().reverse();

  return (
    <div className="all-transactions-page"> {/* Reuse page style */}
      <header className="page-header">
        <Link to="/" className="back-link">← Back to Dashboard</Link>
        <h1>Monthly Summary</h1>
      </header>
      <main>
        {sortedMonths.map(monthKey => {
          const data = monthlyData[monthKey];
          const netResult = data.totalIncome - data.totalExpenses;
          
          return (
            <div key={monthKey} className="card monthly-summary-card">
              <div className="month-header">
                <h2>{data.monthName}</h2>
                <p className={`net-result ${netResult >= 0 ? 'positive' : 'negative'}`}>
                  {netResult >= 0 ? `+₹${netResult.toFixed(2)}` : `-₹${Math.abs(netResult).toFixed(2)}`}
                </p>
              </div>
              <div className="month-stats">
                <div className="stat-item income">
                  <span>Total Income</span>
                  <p>₹{data.totalIncome.toFixed(2)}</p>
                </div>
                <div className="stat-item expense">
                  <span>Total Expenses</span>
                  <p>₹{data.totalExpenses.toFixed(2)}</p>
                </div>
              </div>
            </div>
          );
        })}
        {sortedMonths.length === 0 && <div className="card"><p className="no-transactions">No transactions to summarize.</p></div>}
      </main>
    </div>
  );
};

export default MonthlySummary;
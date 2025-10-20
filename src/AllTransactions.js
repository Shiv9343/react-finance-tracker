import React from 'react';
import { Link } from 'react-router-dom';

const AllTransactions = ({ transactions, removeTransaction }) => {
  return (
    <div className="all-transactions-page">
      <header className="page-header">
        <Link to="/" className="back-link">← Back to Dashboard</Link>
        <h1>All Transactions</h1>
      </header>
      <main>
        <div className="recent-transactions">
          <ul>
            {transactions.map((t) => (
              <li key={t.id} className={`transaction-item ${t.type}`}>
                <div className="transaction-details">
                  <div className="transaction-info">
                    <span className="transaction-description">{t.description}</span>
                    <span className="transaction-category">{t.category}</span>
                  </div>
                </div>
                <span className="transaction-amount">
                  {t.type === 'income' ? '+' : '-'}₹{(t.amount || 0).toFixed(2)}
                </span>
                <button className="delete-btn" onClick={() => removeTransaction(t.id)}>X</button>
              </li>
            ))}
            {transactions.length === 0 && <p className="no-transactions">You have no transactions yet.</p>}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default AllTransactions;
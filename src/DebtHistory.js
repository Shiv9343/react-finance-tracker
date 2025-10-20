import React from 'react';
import { Link } from 'react-router-dom';

const DebtHistory = ({ debts }) => {
  const paidDebts = debts.filter(debt => debt.status === 'paid');

  return (
    <div className="all-transactions-page">
      <header className="page-header">
        <Link to="/" className="back-link">← Back to Dashboard</Link>
        <h1>Debt History</h1>
      </header>
      <main>
        <div className="recent-transactions card">
          <ul>
            {paidDebts.map((debt) => (
              // CHANGED: Added the 'is-paid' class to this list item
              <li key={debt.id} className={`transaction-item ${debt.type} is-paid`}>
                <div className="transaction-details">
                  <div className="transaction-info">
                    <span className="transaction-description">{debt.description}</span>
                    <span className="transaction-category">
                      {debt.type === 'lent' 
                        ? `You lent to ${debt.friendName} (Paid)` 
                        : `You borrowed from ${debt.friendName} (Paid)`}
                    </span>
                  </div>
                </div>
                <span className="transaction-amount">
                  ₹{debt.amount.toFixed(2)}
                </span>
              </li>
            ))}
            {paidDebts.length === 0 && <p className="no-transactions">You have no paid debts.</p>}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default DebtHistory;
import React, { useState } from 'react';
import Modal from 'react-modal';

// This component now receives ALL the state and functions it needs from App.js
const AddModal = ({ isOpen, onRequestClose, ...props }) => {
  const [formType, setFormType] = useState('transaction'); // 'transaction' or 'iou'

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Transaction or IOU"
      className="Modal"
      overlayClassName="Overlay"
      appElement={document.getElementById('root')}
    >
      <div className="modal-header">
        <button 
            className={`modal-tab ${formType === 'transaction' ? 'active' : ''}`} 
            onClick={() => setFormType('transaction')}
        >
            Transaction
        </button>
        <button 
            className={`modal-tab ${formType === 'iou' ? 'active' : ''}`} 
            onClick={() => setFormType('iou')}
        >
            IOU
        </button>
        <button onClick={onRequestClose} className="close-btn">×</button>
      </div>

      {formType === 'transaction' ? (
        <form className="transaction-form" onSubmit={props.addTransaction}>
            <h3>Add Transaction</h3>
            <div className="transaction-type-selector"><button type="button" className={`type-btn ${props.type === 'expense' ? 'active' : ''}`} onClick={() => props.setType('expense')}>Expense</button><button type="button" className={`type-btn ${props.type === 'income' ? 'active' : ''}`} onClick={() => props.setType('income')}>Income</button></div>
            <input type="text" placeholder="Description" value={props.description} onChange={(e) => props.setDescription(e.target.value)} />
            <input type="number" placeholder="Amount" value={props.amount} onChange={(e) => props.setAmount(e.target.value)} />
            {props.type === 'expense' && (<> <select value={props.category} onChange={(e) => props.setCategory(e.target.value)}><option value="Food">Food 🍔</option><option value="Transport">Transport 🚗</option><option value="Shopping">Shopping 🛍️</option><option value="Entertainment">Entertainment 🎬</option><option value="Bills">Bills 🧾</option><option value="Other">Other</option></select> {props.category === 'Other' && (<input type="text" placeholder="Specify 'Other' category" value={props.customCategory} onChange={(e) => props.setCustomCategory(e.target.value)} className="custom-category-input" />)} </>)}
            <button type="submit">Add</button>
        </form>
      ) : (
        <form className="transaction-form" onSubmit={props.addDebt}>
            <h3>Track Friend's IOUs</h3>
            <div className="transaction-type-selector"><button type="button" className={`type-btn ${props.debtType === 'lent' ? 'active' : ''}`} onClick={() => props.setDebtType('lent')}>I Gave (Lent)</button><button type="button" className={`type-btn ${props.debtType === 'borrowed' ? 'active' : ''}`} onClick={() => props.setDebtType('borrowed')}>I Got (Borrowed)</button></div>
            <input type="text" placeholder="Friend's Name" value={props.friendName} onChange={(e) => props.setFriendName(e.target.value)} />
            <input type="text" placeholder="Description" value={props.debtDescription} onChange={(e) => props.setDebtDescription(e.target.value)} />
            <input type="number" placeholder="Amount" value={props.debtAmount} onChange={(e) => props.setDebtAmount(e.target.value)} />
            <button type="submit">Add IOU</button>
        </form>
      )}
    </Modal>
  );
};

export default AddModal;
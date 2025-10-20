import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { db } from './firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy, where, updateDoc } from 'firebase/firestore';
// NEW: Import updateProfile here as well
import { getAuth, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';

// NEW: Importing icons from the library
import { FaArrowUp, FaArrowDown, FaRegListAlt, FaHandshake } from 'react-icons/fa';

// Import all our components/pages
import Login from './Login';
import AllTransactions from './AllTransactions';
import DebtHistory from './DebtHistory';
import MonthlySummary from './MonthlySummary';
import TransactionChart from './TransactionChart';
import DebtChart from './DebtChart';
// NOTE: We are not using the AddModal in this version as requested

// --- Dashboard Component ---
const Dashboard = ({ userName, currentDate, transactions, removeTransaction, ...props }) => {
  const outstandingDebts = props.debts.filter(d => d.status === 'outstanding');

  return (
    <>
      <header className="app-header">
        <div className="header-left" onClick={props.handleUpdateName} title="Click to change name">
          <p className="greeting">Hello {userName}</p>
          <p className="current-date">{currentDate}</p>
        </div>
        <button onClick={props.handleLogout} className="logout-btn">Logout</button>
      </header>
      <main>
        {/* CHANGED: Added icons to the summary cards */}
        <div className="summary-cards">
            <div className="summary-card income">
                <div className="card-icon"><FaArrowUp /></div>
                <div>
                    <p className="card-label">Total Income</p>
                    <p className="card-amount">₹{props.totalIncome.toFixed(2)}</p>
                </div>
            </div>
            <div className="summary-card expense">
                <div className="card-icon"><FaArrowDown /></div>
                <div>
                    <p className="card-label">Total Expense</p>
                    <p className="card-amount">₹{props.totalExpenses.toFixed(2)}</p>
                </div>
            </div>
        </div>
        <div className="balance-overview"><p className="balance-label">Current Balance</p><p className="balance-amount">₹{props.currentBalance.toFixed(2)}</p></div>
        <div className="budget-section card"><h3>Monthly Budget</h3> <p className="budget-value">₹{props.budget.toFixed(2)}</p> <div className="budget-progress"><div className="progress-bar" style={{ width: `${Math.min(100, (props.totalExpenses / props.budget) * 100)}%`}}></div></div> <p className="budget-remaining">Remaining: ₹{(props.budget - props.totalExpenses).toFixed(2)}</p> <form className="budget-form" onSubmit={props.handleSetBudget}><input type="number" placeholder="Set your monthly budget" value={props.newBudget} onChange={(e) => props.setNewBudget(e.target.value)} /><button type="submit">Set</button></form></div>
        
        {/* CHANGED: Added back emojis to the dropdown */}
        <form className="transaction-form card" onSubmit={props.addTransaction}><h3>Add Transaction</h3><div className="transaction-type-selector"><button type="button" className={`type-btn ${props.type === 'expense' ? 'active' : ''}`} onClick={() => props.setType('expense')}>Expense</button><button type="button" className={`type-btn ${props.type === 'income' ? 'active' : ''}`} onClick={() => props.setType('income')}>Income</button></div><input type="text" placeholder="Description" value={props.description} onChange={(e) => props.setDescription(e.target.value)} /><input type="number" placeholder="Amount" value={props.amount} onChange={(e) => props.setAmount(e.target.value)} />{props.type === 'expense' && (<> <select value={props.category} onChange={(e) => props.setCategory(e.target.value)}><option value="Food">Food 🍔</option><option value="Transport">Transport 🚗</option><option value="Shopping">Shopping 🛍️</option><option value="Entertainment">Entertainment 🎬</option><option value="Bills">Bills 🧾</option><option value="Other">Other</option></select> {props.category === 'Other' && (<input type="text" placeholder="Specify 'Other' category" value={props.customCategory} onChange={(e) => props.setCustomCategory(e.target.value)} className="custom-category-input" />)} </>)}<button type="submit">Add</button></form>
        <form className="transaction-form card" onSubmit={props.addDebt}><h3>Track Friend's IOUs</h3><div className="transaction-type-selector"><button type="button" className={`type-btn ${props.debtType === 'lent' ? 'active' : ''}`} onClick={() => props.setDebtType('lent')}>I Gave (Lent)</button><button type="button" className={`type-btn ${props.debtType === 'borrowed' ? 'active' : ''}`} onClick={() => props.setDebtType('borrowed')}>I Got (Borrowed)</button></div><input type="text" placeholder="Friend's Name" value={props.friendName} onChange={(e) => props.setFriendName(e.target.value)} /><input type="text" placeholder="Description" value={props.debtDescription} onChange={(e) => props.setDebtDescription(e.target.value)} /><input type="number" placeholder="Amount" value={props.debtAmount} onChange={(e) => props.setDebtAmount(e.target.value)} /><button type="submit">Add IOU</button></form>
        
        <div className="recent-transactions">
          <h3 className="card-title"><FaHandshake /> Outstanding Debts</h3>
          <ul>{outstandingDebts.map((debt) => (<li key={debt.id} className={`transaction-item ${debt.type}`}><div className="transaction-details"><div className="transaction-info"><span className="transaction-description">{debt.description}</span><span className="transaction-category">{debt.type === 'lent' ? `You lent to ${debt.friendName}` : `You borrowed from ${debt.friendName}`}</span></div></div><div className="debt-actions"><span className="transaction-amount">₹{(debt.amount || 0).toFixed(2)}</span><button className="paid-btn" onClick={() => props.markDebtAsPaid(debt)}>Paid</button></div></li>))}{outstandingDebts.length === 0 && <p className="no-transactions">No outstanding debts.</p>}</ul>
          <Link to="/debt-history" className="view-all-btn">View Debt History</Link>
        </div>
        
        <div className="recent-transactions">
          <h3 className="card-title"><FaRegListAlt /> Recent Transactions</h3>
          <ul>{transactions.slice(0, 5).map((t) => (<li key={t.id} className={`transaction-item ${t.type}`}><div className="transaction-details"><div className="transaction-info"><span className="transaction-description">{t.description}</span><span className="transaction-category">{t.category}</span></div></div><span className="transaction-amount">{t.type === 'income' ? '+' : '-'}₹{(t.amount || 0).toFixed(2)}</span><button className="delete-btn" onClick={() => removeTransaction(t.id)}>X</button></li>))}</ul>
          <div className="card-nav-links">
            {transactions.length > 0 && ( <Link to="/transactions" className="view-all-btn">View All</Link> )}
            <Link to="/monthly-summary" className="view-all-btn">Monthly Summary</Link>
          </div>
        </div>

        <TransactionChart transactions={transactions} />
        <DebtChart debts={outstandingDebts} />
      </main>
    </>
  );
}

// --- Main App Component ---
function App() {
  const [user, setUser] = useState(null); const [loading, setLoading] = useState(true); const [transactions, setTransactions] = useState([]); const [debts, setDebts] = useState([]); const [description, setDescription] = useState(''); const [amount, setAmount] = useState(''); const [category, setCategory] = useState('Food'); const [type, setType] = useState('expense'); const [customCategory, setCustomCategory] = useState(''); const [debtDescription, setDebtDescription] = useState(''); const [debtAmount, setDebtAmount] = useState(''); const [debtType, setDebtType] = useState('lent'); const [friendName, setFriendName] = useState(''); const [budget, setBudget] = useState(() => { const savedBudget = localStorage.getItem('monthlyBudget'); return savedBudget ? parseFloat(savedBudget) : 0; }); const [newBudget, setNewBudget] = useState(''); const auth = getAuth();
  useEffect(() => { const unsubscribe = onAuthStateChanged(auth, (currentUser) => { setUser(currentUser); setLoading(false); }); return () => unsubscribe(); }, [auth]);
  useEffect(() => { localStorage.setItem('monthlyBudget', budget); }, [budget]);
  useEffect(() => { if (!user) { setTransactions([]); return; } const c = collection(db, 'transactions'); const q = query(c, where("userId", "==", user.uid), orderBy('createdAt', 'desc')); const unsub = onSnapshot(q, (s) => setTransactions(s.docs.map(d => ({ id: d.id, ...d.data() })))); return () => unsub(); }, [user]);
  useEffect(() => { if (!user) { setDebts([]); return; } const c = collection(db, 'debts'); const q = query(c, where("userId", "==", user.uid), orderBy('createdAt', 'desc')); const unsub = onSnapshot(q, (s) => setDebts(s.docs.map(d => ({ id: d.id, ...d.data() })))); return () => unsub(); }, [user]);

  const handleUpdateName = async () => { const newName = prompt("Enter your new display name:"); if (newName && newName.trim() !== "") { try { await updateProfile(auth.currentUser, { displayName: newName }); } catch (error) { alert("Error updating name: " + error.message); } } };
  const addTransaction = async (e) => { e.preventDefault(); if (!description || !amount) return; let finalCategory = type === 'income' ? 'Income' : (category === 'Other' ? `Other: ${customCategory}` : category); if (category === 'Other' && !customCategory) { alert('Please specify "Other"'); return; } await addDoc(collection(db, 'transactions'), { userId: user.uid, description, amount: parseFloat(amount), category: finalCategory, type, createdAt: serverTimestamp() }); setDescription(''); setAmount(''); setCategory('Food'); setType('expense'); setCustomCategory(''); }; const removeTransaction = async (id) => { await deleteDoc(doc(db, 'transactions', id)); }; const addDebt = async (e) => { e.preventDefault(); if (!debtDescription || !debtAmount || !friendName) return; await addDoc(collection(db, 'debts'), { userId: user.uid, description: debtDescription, amount: parseFloat(debtAmount), friendName, type: debtType, status: 'outstanding', createdAt: serverTimestamp() }); const transType = debtType === 'lent' ? 'expense' : 'income'; const transDesc = debtType === 'lent' ? `Lent to ${friendName}: ${debtDescription}` : `Borrowed from ${friendName}: ${debtDescription}`; await addDoc(collection(db, 'transactions'), { userId: user.uid, description: transDesc, amount: parseFloat(debtAmount), category: 'Loan', type: transType, createdAt: serverTimestamp() }); setDebtDescription(''); setDebtAmount(''); setFriendName(''); setDebtType('lent'); }; const markDebtAsPaid = async (debt) => { await updateDoc(doc(db, 'debts', debt.id), { status: 'paid' }); const transType = debt.type === 'lent' ? 'income' : 'expense'; const transDesc = debt.type === 'lent' ? `Payback from ${debt.friendName}` : `Paid back ${debt.friendName}`; await addDoc(collection(db, 'transactions'), { userId: user.uid, description: transDesc, amount: debt.amount, category: 'Loan', type: transType, createdAt: serverTimestamp() }); }; const handleSetBudget = (e) => { e.preventDefault(); if(newBudget) setBudget(parseFloat(newBudget)); setNewBudget(''); }; const handleLogout = () => { signOut(auth); };
  
  const totalIncome = transactions.reduce((sum, t) => t.type === 'income' ? sum + (t.amount || 0) : sum, 0);
  const totalExpenses = transactions.reduce((sum, t) => t.type === 'expense' ? sum + (t.amount || 0) : sum, 0);
  const currentBalance = totalIncome - totalExpenses;
  const currentDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const userName = user ? (user.displayName || user.email.split('@')[0]) : 'User';

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user) return <div className="App"><Login /></div>;

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Dashboard userName={userName} currentDate={currentDate} transactions={transactions} removeTransaction={removeTransaction} totalIncome={totalIncome} totalExpenses={totalExpenses} currentBalance={currentBalance} budget={budget} handleSetBudget={handleSetBudget} newBudget={newBudget} setNewBudget={setNewBudget} addTransaction={addTransaction} description={description} setDescription={setDescription} amount={amount} setAmount={setAmount} category={category} setCategory={setCategory} type={type} setType={setType} customCategory={customCategory} setCustomCategory={setCustomCategory} addDebt={addDebt} debtDescription={debtDescription} setDebtDescription={setDebtDescription} debtAmount={debtAmount} setDebtAmount={setDebtAmount} debtType={debtType} setDebtType={setDebtType} friendName={friendName} setFriendName={setFriendName} debts={debts} markDebtAsPaid={markDebtAsPaid} handleLogout={handleLogout} handleUpdateName={handleUpdateName} />} />
        <Route path="/transactions" element={<AllTransactions transactions={transactions} removeTransaction={removeTransaction} />} />
        <Route path="/debt-history" element={<DebtHistory debts={debts} />} />
        <Route path="/monthly-summary" element={ <MonthlySummary transactions={transactions} /> } />
      </Routes>
    </div>
  );
}

export default App;
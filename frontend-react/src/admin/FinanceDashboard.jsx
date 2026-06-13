import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Admin.css';

const FinanceDashboard = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('expenses');
    
    // Expenses State
    const [expenses, setExpenses] = useState([]);
    const [tours, setTours] = useState([]);
    const [expenseForm, setExpenseForm] = useState({ category: 'Fuel', amount: '', description: '', vehiclePlate: '', tourId: '' });
    
    // Payroll State
    const [payrolls, setPayrolls] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [payrollForm, setPayrollForm] = useState({ staffId: '', month: 'May 2024', leavesTaken: 0, bonus: 0 });

    useEffect(() => {
        fetchExpenses();
        fetchPayrolls();
        fetchStaff();
        fetchTours();
    }, []);

    const fetchExpenses = async () => {
        const res = await fetch('/api/expenses', { headers: { 'Authorization': `Bearer ${user?.token}` } });
        if(res.ok) setExpenses(await res.json());
    };

    const fetchPayrolls = async () => {
        const res = await fetch('/api/payroll', { headers: { 'Authorization': `Bearer ${user?.token}` } });
        if(res.ok) setPayrolls(await res.json());
    };

    const fetchStaff = async () => {
        const res = await fetch('/api/staff', { headers: { 'Authorization': `Bearer ${user?.token}` } });
        if(res.ok) setStaffList(await res.json());
    };

    const fetchTours = async () => {
        const res = await fetch('/api/tours', { headers: { 'Authorization': `Bearer ${user?.token}` } });
        if(res.ok) setTours(await res.json());
    };

    const handleExpenseSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/expenses', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(expenseForm)
            });
            if (res.ok) {
                fetchExpenses();
                setExpenseForm({ category: 'Fuel', amount: '', description: '', vehiclePlate: '', tourId: '' });
                alert('Expense logged successfully!');
            } else {
                const errorData = await res.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handlePayrollSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/payroll', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(payrollForm)
            });
            if (res.ok) {
                fetchPayrolls();
                setPayrollForm({ staffId: '', month: 'May 2024', leavesTaken: 0, bonus: 0 });
                alert('Payroll processed successfully!');
            } else {
                const errorData = await res.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const deleteExpense = async (id) => {
        if(window.confirm('Delete this expense?')) {
            await fetch(`/api/expenses/${id}`, { 
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user?.token}` }
            });
            fetchExpenses();
        }
    };

    return (
        <div className="admin-content p-4">
            <h2 className="mb-4" style={{ fontWeight: 'bold' }}>Finance & Operations</h2>
            
            <div className="mb-4" style={{ display: 'flex', gap: '15px' }}>
                <button 
                    onClick={() => setActiveTab('expenses')}
                    style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: activeTab === 'expenses' ? '#007bff' : '#e9ecef', color: activeTab === 'expenses' ? 'white' : 'black', fontWeight: 'bold', cursor: 'pointer' }}>
                    <i className="fas fa-receipt"></i> Expenses
                </button>
                <button 
                    onClick={() => setActiveTab('payroll')}
                    style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: activeTab === 'payroll' ? '#007bff' : '#e9ecef', color: activeTab === 'payroll' ? 'white' : 'black', fontWeight: 'bold', cursor: 'pointer' }}>
                    <i className="fas fa-money-check-alt"></i> Payroll
                </button>
            </div>

            {activeTab === 'expenses' && (
                <div className="row">
                    <div className="col-md-4">
                        <div className="admin-card p-4">
                            <h4 className="mb-3">Log New Expense</h4>
                            <form onSubmit={handleExpenseSubmit}>
                                <div className="mb-3">
                                    <label>Category</label>
                                    <select className="form-control" value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})}>
                                        <option value="Fuel">Fuel</option>
                                        <option value="Toll Tax">Toll Tax</option>
                                        <option value="Vehicle Repair">Vehicle Repair</option>
                                        <option value="Food">Food</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label>Amount (PKR/USD)</label>
                                    <input type="number" className="form-control" required value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} />
                                </div>
                                <div className="mb-3">
                                    <label>Vehicle Plate (Optional)</label>
                                    <input type="text" className="form-control" placeholder="e.g. LZN-1234" value={expenseForm.vehiclePlate} onChange={e => setExpenseForm({...expenseForm, vehiclePlate: e.target.value})} />
                                </div>
                                <div className="mb-3">
                                    <label>Associated Trip/Tour (Optional)</label>
                                    <select className="form-control" value={expenseForm.tourId} onChange={e => setExpenseForm({...expenseForm, tourId: e.target.value})}>
                                        <option value="">-- No Tour Assigned --</option>
                                        {tours.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label>Description</label>
                                    <textarea className="form-control" required rows="2" value={expenseForm.description} onChange={e => setExpenseForm({...expenseForm, description: e.target.value})}></textarea>
                                </div>
                                <button className="btn btn-primary w-100" type="submit">Log Expense</button>
                            </form>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="admin-card p-4">
                            <h4 className="mb-3">Recent Expenses</h4>
                            <div className="table-responsive">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Category</th>
                                            <th>Amount</th>
                                            <th>Trip/Tour</th>
                                            <th>Vehicle</th>
                                            <th>Description</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expenses.map(exp => (
                                            <tr key={exp._id}>
                                                <td>{new Date(exp.date).toLocaleDateString()}</td>
                                                <td><span className="status-badge" style={{ background: '#e0f2fe', color: '#0284c7' }}>{exp.category}</span></td>
                                                <td style={{ fontWeight: 'bold' }}>${exp.amount}</td>
                                                <td>{exp.tourId?.title || '-'}</td>
                                                <td>{exp.vehiclePlate || '-'}</td>
                                                <td>{exp.description}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-danger" onClick={() => deleteExpense(exp._id)}><i className="fas fa-trash"></i></button>
                                                </td>
                                            </tr>
                                        ))}
                                        {expenses.length === 0 && <tr><td colSpan="7" className="text-center">No expenses logged yet.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'payroll' && (
                <div className="row">
                    <div className="col-md-4">
                        <div className="admin-card p-4">
                            <h4 className="mb-3">Process Payroll</h4>
                            <form onSubmit={handlePayrollSubmit}>
                                <div className="mb-3">
                                    <label>Select Staff</label>
                                    <select className="form-control" required value={payrollForm.staffId} onChange={e => setPayrollForm({...payrollForm, staffId: e.target.value})}>
                                        <option value="">-- Select Staff --</option>
                                        {staffList.map(s => <option key={s._id} value={s._id}>{s.name} ({s.position})</option>)}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label>Month/Year</label>
                                    <input type="text" className="form-control" required value={payrollForm.month} onChange={e => setPayrollForm({...payrollForm, month: e.target.value})} />
                                </div>
                                <div className="mb-3">
                                    <label>Leaves Taken (Days)</label>
                                    <input type="number" min="0" className="form-control" required value={payrollForm.leavesTaken} onChange={e => setPayrollForm({...payrollForm, leavesTaken: e.target.value})} />
                                    <small className="text-muted">Pay will be cut automatically based on daily wage.</small>
                                </div>
                                <div className="mb-3">
                                    <label>Bonus Amount (Optional)</label>
                                    <input type="number" min="0" className="form-control" value={payrollForm.bonus} onChange={e => setPayrollForm({...payrollForm, bonus: e.target.value})} />
                                </div>
                                <button className="btn btn-success w-100" type="submit">Calculate & Pay</button>
                                <small className="text-muted d-block mt-2 text-center" style={{ fontSize: '11px' }}>
                                    <i className="fas fa-info-circle"></i> Salary will be directly deposited into the staff member's digital wallet account.
                                </small>
                            </form>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="admin-card p-4">
                            <h4 className="mb-3">Payroll History</h4>
                            <div className="table-responsive">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Staff</th>
                                            <th>Month</th>
                                            <th>Base Salary</th>
                                            <th>Leave Cut</th>
                                            <th>Bonus</th>
                                            <th>Net Paid</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payrolls.map(pay => (
                                            <tr key={pay._id}>
                                                <td style={{ fontWeight: 'bold' }}>{pay.staffId?.name || 'Unknown'}</td>
                                                <td>{pay.month}</td>
                                                <td>${pay.baseSalary}</td>
                                                <td style={{ color: '#ef4444' }}>-${Math.round(pay.leaveDeduction)}</td>
                                                <td style={{ color: '#22c55e' }}>+${pay.bonus}</td>
                                                <td style={{ fontWeight: 'bold', fontSize: '16px' }}>${Math.round(pay.netSalary)}</td>
                                                <td><span className="status-badge" style={{ background: '#dcfce7', color: '#166534' }}>{pay.status}</span></td>
                                            </tr>
                                        ))}
                                        {payrolls.length === 0 && <tr><td colSpan="7" className="text-center">No payrolls processed yet.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinanceDashboard;

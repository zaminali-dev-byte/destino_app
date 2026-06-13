import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const StaffExpenses = () => {
    const { user } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        category: 'Other',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    const fetchMyExpenses = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/expenses/my', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await res.json();
            setExpenses(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch expenses", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.token) {
            fetchMyExpenses();
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const expenseData = {
                ...formData,
                staffId: user._id,
                vehiclePlate: user.vehicleNumber || ''
            };
            const res = await fetch('/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(expenseData)
            });
            
            if (res.ok) {
                alert("Expense logged successfully!");
                setFormData({ category: 'Other', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
                fetchMyExpenses();
            } else {
                const errData = await res.json();
                alert(errData.message || "Failed to log expense.");
            }
        } catch (err) {
            alert("Error logging expense.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="staff-expenses-container" style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
            {/* Submit Expense Form */}
            <div style={{ flex: '0 0 350px', background: 'var(--admin-card-bg)', padding: '30px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                <h3 style={{ borderBottom: '1px solid var(--admin-border)', paddingBottom: '15px', marginBottom: '20px', fontSize: '20px', color: 'var(--admin-text-main)' }}>Log New Expense</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-15">
                        <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '5px', color: 'var(--admin-text-main)' }}>Category</label>
                        <select 
                            value={formData.category} 
                            onChange={(e) => setFormData({...formData, category: e.target.value})} 
                            style={{ width: '100%', padding: '10px', border: '1px solid var(--admin-border)', borderRadius: '4px', background: 'var(--admin-bg)', color: 'var(--admin-text-main)' }}
                            required
                        >
                            <option value="Fuel">Fuel</option>
                            <option value="Maintenance">Vehicle Maintenance</option>
                            <option value="Salaries">Salaries/Advances</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Office Supplies">Office Supplies</option>
                            <option value="Tour Expenses">Tour Expenses</option>
                            <option value="Fines & Penalties">Fines & Penalties (e.g., Traffic)</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-group mb-15">
                        <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '5px', color: 'var(--admin-text-main)' }}>Amount (PKR / USD)</label>
                        <input 
                            type="number" 
                            value={formData.amount} 
                            onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                            style={{ width: '100%', padding: '10px', border: '1px solid var(--admin-border)', borderRadius: '4px', background: 'var(--admin-bg)', color: 'var(--admin-text-main)' }} 
                            required 
                            min="1"
                        />
                    </div>
                    <div className="form-group mb-15">
                        <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '5px', color: 'var(--admin-text-main)' }}>Date</label>
                        <input 
                            type="date" 
                            value={formData.date} 
                            onChange={(e) => setFormData({...formData, date: e.target.value})} 
                            style={{ width: '100%', padding: '10px', border: '1px solid var(--admin-border)', borderRadius: '4px', background: 'var(--admin-bg)', color: 'var(--admin-text-main)' }} 
                            required 
                        />
                    </div>
                    <div className="form-group mb-25">
                        <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '5px', color: 'var(--admin-text-main)' }}>Description / Reason</label>
                        <textarea 
                            value={formData.description} 
                            onChange={(e) => setFormData({...formData, description: e.target.value})} 
                            placeholder="Provide details for this expense..." 
                            style={{ width: '100%', padding: '10px', border: '1px solid var(--admin-border)', borderRadius: '4px', minHeight: '80px', background: 'var(--admin-bg)', color: 'var(--admin-text-main)' }} 
                            required
                        />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="theme-btn style-two w-100" style={{ padding: '12px' }}>
                        <span data-hover={isSubmitting ? "Submitting..." : "Submit Expense"}>
                            {isSubmitting ? "Submitting..." : "Submit Expense"}
                        </span>
                    </button>
                </form>
            </div>

            {/* Expense History Table */}
            <div style={{ flex: 1, background: 'var(--admin-card-bg)', padding: '30px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                <h3 style={{ borderBottom: '1px solid var(--admin-border)', paddingBottom: '15px', marginBottom: '20px', fontSize: '20px', color: 'var(--admin-text-main)' }}>My Expense History</h3>
                {loading ? (
                    <div className="text-center py-50"><div className="spinner-border text-primary"></div></div>
                ) : expenses.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', background: 'var(--admin-bg)', borderRadius: '8px', border: '1px dashed var(--admin-border)' }}>
                        <i className="fal fa-file-invoice-dollar mb-10" style={{ fontSize: '40px', color: 'var(--admin-text-muted)' }}></i>
                        <p style={{ margin: 0, color: 'var(--admin-text-muted)' }}>You haven't logged any expenses yet.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'var(--admin-bg)', color: 'var(--admin-text-main)', borderBottom: '2px solid var(--admin-border)' }}>
                                    <th style={{ padding: '12px', fontWeight: 'bold' }}>Date</th>
                                    <th style={{ padding: '12px', fontWeight: 'bold' }}>Category</th>
                                    <th style={{ padding: '12px', fontWeight: 'bold' }}>Description</th>
                                    <th style={{ padding: '12px', fontWeight: 'bold' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map(exp => (
                                    <tr key={exp._id} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--admin-text-muted)' }}>{new Date(exp.date).toLocaleDateString()}</td>
                                        <td style={{ padding: '12px' }}>
                                            <span style={{ 
                                                background: exp.category === 'Fines & Penalties' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(14, 165, 233, 0.1)', 
                                                color: exp.category === 'Fines & Penalties' ? '#ef4444' : '#0ea5e9', 
                                                padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' 
                                            }}>
                                                {exp.category}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--admin-text-main)', maxWidth: '250px' }}>{exp.description}</td>
                                        <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--admin-text-main)' }}>{exp.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffExpenses;

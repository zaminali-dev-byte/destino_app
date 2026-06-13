import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement
);

const StaffAnalytics = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/staff/stats', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                const data = await res.json();
                setStats(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch stats", err);
                setLoading(false);
            }
        };
        fetchStats();
    }, [user.token]);

    if (loading) return <div className="text-center py-50"><div className="spinner-border"></div></div>;
    if (!stats) return <div>Failed to load analytics.</div>;

    const renderFinanceHRCharts = () => {
        if (!stats.finance) return null;
        
        const expensePayrollData = {
            labels: ['Total Expenses', 'Total Payroll'],
            datasets: [
                {
                    label: 'Amount (PKR)',
                    data: [stats.finance.totalExpenses, stats.finance.totalPayroll],
                    backgroundColor: ['rgba(239, 68, 68, 0.7)', 'rgba(59, 130, 246, 0.7)'],
                    borderWidth: 1,
                },
            ],
        };

        const hrData = {
            labels: ['Active Staff', 'Pending Applications'],
            datasets: [
                {
                    data: [stats.finance.staffCount, stats.finance.pendingApps],
                    backgroundColor: ['#10b981', '#f59e0b'],
                    borderWidth: 0,
                },
            ],
        };

        return (
            <div className="row">
                <div className="col-md-6 mb-30">
                    <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                        <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Expenditure vs Payroll</h4>
                        <Bar data={expensePayrollData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                    </div>
                </div>
                <div className="col-md-6 mb-30">
                    <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                        <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>HR Pipeline Overview</h4>
                        <div style={{ width: '60%', margin: '0 auto' }}>
                            <Pie data={hrData} />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderSalesMarketingCharts = () => {
        if (!stats.sales) return null;

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const lineData = {
            labels: months,
            datasets: [
                {
                    label: 'Bookings Created',
                    data: stats.sales.monthlyBookingsData,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    tension: 0.3
                }
            ]
        };

        const conversionData = {
            labels: ['Completed/Paid Bookings', 'Pending/Canceled Bookings'],
            datasets: [
                {
                    data: [stats.sales.completedBookings, stats.sales.totalBookings - stats.sales.completedBookings],
                    backgroundColor: ['#10b981', '#ef4444'],
                }
            ]
        };

        return (
            <div className="row">
                <div className="col-md-8 mb-30">
                    <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                        <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Monthly Booking Volume Trends</h4>
                        <Line data={lineData} options={{ responsive: true }} />
                    </div>
                </div>
                <div className="col-md-4 mb-30">
                    <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', height: '100%' }}>
                        <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Booking Conversion Rate</h4>
                        <Doughnut data={conversionData} />
                        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>
                            {stats.sales.totalBookings > 0 ? Math.round((stats.sales.completedBookings / stats.sales.totalBookings) * 100) : 0}%
                        </div>
                        <div style={{ textAlign: 'center', color: '#64748b', fontSize: '14px' }}>Overall Completion Rate</div>
                    </div>
                </div>
            </div>
        );
    };

    const renderOperationsCharts = () => {
        if (!stats.operations) return null;

        const taskData = {
            labels: ['Accepted Tasks', 'Pending Tasks'],
            datasets: [
                {
                    data: [stats.operations.acceptedTasks, stats.operations.pendingTasks],
                    backgroundColor: ['#3b82f6', '#f59e0b'],
                }
            ]
        };

        return (
            <div className="row">
                <div className="col-md-6 mb-30">
                    <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', height: '100%' }}>
                        <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Personal Task Status</h4>
                        <div style={{ width: '70%', margin: '0 auto' }}>
                            <Doughnut data={taskData} />
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-30">
                    <div style={{ background: '#0ea5e9', color: '#fff', padding: '40px 20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(14, 165, 233, 0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <i className="fas fa-route mb-15" style={{ fontSize: '40px' }}></i>
                        <h3 style={{ color: '#fff', margin: '0 0 10px 0', fontSize: '48px' }}>{stats.operations.totalAssigned}</h3>
                        <p style={{ margin: 0, fontSize: '18px', opacity: 0.9 }}>Total Lifetime Trip Assignments</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="staff-analytics-container" style={{ background: '#f8fafc', padding: '30px', borderRadius: '12px' }}>
            <div style={{ marginBottom: '30px' }}>
                <h3 style={{ margin: '0 0 5px 0', color: '#1e293b' }}><i className="fas fa-chart-pie text-primary"></i> Department Analytics Dashboard</h3>
                <p style={{ color: '#64748b', margin: 0 }}>Visualized metrics tailored for your role in the {user?.department || 'company'}.</p>
            </div>
            
            {renderFinanceHRCharts()}
            {renderSalesMarketingCharts()}
            {renderOperationsCharts()}

            {!stats.finance && !stats.sales && !stats.operations && (
                <div style={{ textAlign: 'center', padding: '50px', background: '#fff', borderRadius: '8px' }}>
                    <p style={{ color: '#64748b' }}>No analytics views configured for your specific department yet.</p>
                </div>
            )}
        </div>
    );
};

export default StaffAnalytics;
